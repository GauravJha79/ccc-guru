import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Library, ShoppingCart, ExternalLink, ArrowLeft } from "lucide-react";
import { getBookById, getBooks, getAllBookIds } from "@/lib/data/books";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { siteUrl } from "@/lib/utils";

export const revalidate = 3600;

interface BookPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const ids = await getAllBookIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: BookPageProps): Promise<Metadata> {
  const { id } = await params;
  const book = await getBookById(id);
  if (!book) return { title: "Book Not Found" };

  return {
    title: book.title,
    description:
      book.description ??
      `${book.title} by ${book.author} — Recommended CCC exam preparation book.`,
    alternates: { canonical: `/books/${id}` },
    openGraph: {
      title: book.title,
      description: book.description ?? `${book.title} by ${book.author}`,
      url: `/books/${id}`,
      ...(book.cover_image ? { images: [{ url: book.cover_image }] } : {}),
    },
  };
}

const RETAILER_CONFIG: Record<
  string,
  { label: string; icon: string; color: string }
> = {
  Amazon: {
    label: "Buy on Amazon",
    icon: "🛒",
    color: "bg-amber-500 hover:bg-amber-400 text-white",
  },
  Flipkart: {
    label: "Buy on Flipkart",
    icon: "🛍️",
    color: "bg-blue-600 hover:bg-blue-500 text-white",
  },
  BookBazaar: {
    label: "Buy on BookBazaar",
    icon: "📚",
    color: "bg-emerald-600 hover:bg-emerald-500 text-white",
  },
  Other: {
    label: "Buy Now",
    icon: "🔗",
    color: "bg-primary-600 hover:bg-primary-500 text-white",
  },
};

export default async function BookPage({ params }: BookPageProps) {
  const { id } = await params;
  const book = await getBookById(id);

  if (!book) notFound();

  // Related books
  const allBooks = await getBooks({ limit: 6 });
  const related = allBooks.filter((b) => b.id !== id).slice(0, 3);

  // Book JSON-LD
  const bookJsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    author: { "@type": "Person", name: book.author },
    description: book.description,
    inLanguage: book.language,
    numberOfPages: book.pages,
    publisher: book.publisher
      ? { "@type": "Organization", name: book.publisher }
      : undefined,
    isbn: book.isbn ?? undefined,
    ...(book.cover_image ? { image: book.cover_image } : {}),
    url: siteUrl(`/books/${id}`),
  };

  return (
    <div className="container-page py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bookJsonLd) }}
      />

      <Breadcrumbs
        items={[{ label: "Books", href: "/books" }, { label: book.title }]}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
        {/* Left: Cover */}
        <div className="md:col-span-1 flex flex-col items-center gap-4">
          <div className="w-full max-w-[220px] aspect-[3/4] rounded-xl overflow-hidden shadow-modal bg-primary-50 dark:bg-primary-950 flex items-center justify-center">
            {book.cover_image ? (
              <Image
                src={book.cover_image}
                alt={book.title}
                width={220}
                height={293}
                className="object-cover w-full h-full"
                priority
              />
            ) : (
              <Library className="w-16 h-16 text-primary-300" />
            )}
          </div>

          {/* Buy buttons */}
          {book.book_links.length > 0 ? (
            <div className="w-full space-y-2">
              {book.book_links.map((link) => {
                const config =
                  RETAILER_CONFIG[link.platform] ?? RETAILER_CONFIG.Other;
                return (
                  <a
                    key={link.id}
                    href={link.affiliate_url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className={`flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-semibold text-sm transition-colors ${config.color}`}
                    id={`buy-${link.platform.toLowerCase()}-btn`}
                  >
                    <span>{config.icon}</span>
                    {config.label}
                    {link.price > 0 && (
                      <span className="ml-auto text-xs opacity-80">
                        ₹{link.price.toFixed(0)}
                      </span>
                    )}
                  </a>
                );
              })}
              <p className="text-xs text-text-muted text-center pt-1">
                * Affiliate link — we may earn a commission
              </p>
            </div>
          ) : (
            <p className="text-sm text-text-muted text-center">
              No purchase links available currently.
            </p>
          )}
        </div>

        {/* Right: Details */}
        <div className="md:col-span-2">
          {book.is_featured && (
            <Badge variant="primary" className="mb-3">
              Editor's Pick
            </Badge>
          )}

          <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-1 leading-tight">
            {book.title}
          </h1>

          {book.hindi_title && book.hindi_title !== book.title && (
            <p className="text-lg text-text-secondary mb-3" lang="hi">
              {book.hindi_title}
            </p>
          )}

          <p className="text-text-muted mb-4">
            by{" "}
            <span className="font-medium text-text-secondary">
              {book.author}
            </span>
          </p>

          {/* Description */}
          {book.description && (
            <p className="text-text-secondary leading-relaxed mb-5">
              {book.description}
            </p>
          )}

          {book.hindi_description &&
            book.hindi_description !== book.description && (
              <p className="text-text-secondary leading-relaxed mb-5" lang="hi">
                {book.hindi_description}
              </p>
            )}

          {/* Specs table */}
          <div className="card rounded-xl overflow-hidden mb-6">
            <table className="w-full text-sm">
              <tbody>
                {[
                  { label: "Author", value: book.author },
                  { label: "Language", value: book.language },
                  { label: "Pages", value: `${book.pages}` },
                  ...(book.edition
                    ? [{ label: "Edition", value: book.edition }]
                    : []),
                  ...(book.publisher
                    ? [{ label: "Publisher", value: book.publisher }]
                    : []),
                  ...(book.isbn ? [{ label: "ISBN", value: book.isbn }] : []),
                ].map(({ label, value }, i) => (
                  <tr
                    key={label}
                    className={i % 2 === 0 ? "bg-bg-subtle" : "bg-surface"}
                  >
                    <td className="px-4 py-3 font-medium text-text-muted w-32">
                      {label}
                    </td>
                    <td className="px-4 py-3 text-text-primary">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Internal link: related tests */}
          <div className="card p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-text-primary text-sm">
                Prepare with Mock Tests
              </p>
              <p className="text-xs text-text-muted">
                Practice what you learn from this book
              </p>
            </div>
            <Link href="/tests" className="btn-primary text-sm shrink-0">
              Take Tests →
            </Link>
          </div>
        </div>
      </div>

      {/* Related books */}
      {related.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold text-text-primary mb-4">
            More Books
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {related.map((b) => (
              <Link
                key={b.id}
                href={`/books/${b.id}`}
                className="card group flex gap-3 p-4"
              >
                <div className="w-12 shrink-0 aspect-[3/4] rounded-lg overflow-hidden bg-primary-50 dark:bg-primary-950 flex items-center justify-center">
                  {b.cover_image ? (
                    <Image
                      src={b.cover_image}
                      alt={b.title}
                      width={48}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <Library className="w-5 h-5 text-primary-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary group-hover:text-primary-600 transition-colors line-clamp-2">
                    {b.title}
                  </p>
                  <p className="text-xs text-text-muted mt-1">{b.author}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
