import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Library, ExternalLink } from 'lucide-react';
import { getBookCategories, getBooks } from '@/lib/data/books';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { CategoryFilter } from '@/components/ui/CategoryFilter';

export const metadata: Metadata = {
  title: 'Best CCC Books — Top Recommended Books for NIELIT CCC',
  description:
    'Discover the best CCC books recommended by experts. Find top-rated books for NIELIT CCC exam preparation with Amazon and Flipkart buy links.',
  alternates: { canonical: '/books' },
  openGraph: {
    title: 'Best CCC Books — Recommended by Experts',
    description: 'Top CCC books with buy links on Amazon and Flipkart.',
    url: '/books',
  },
};

interface BooksPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function BooksPage({ searchParams }: BooksPageProps) {
  const { category } = await searchParams;

  const [categories, books] = await Promise.all([
    getBookCategories(),
    getBooks({ categoryId: category }),
  ]);

  const featured = books.filter((b) => b.is_featured && !category);
  const rest = books.filter((b) => !b.is_featured || category);

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: 'Books' }]} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">CCC Recommended Books</h1>
        <p className="text-text-muted">
          Expert-curated list of top CCC books available on Amazon & Flipkart
        </p>
        <p className="text-xs text-text-muted mt-1">
          * Affiliate disclosure: We may earn a commission from purchases made through our links.
        </p>
      </div>

      {/* Category filter */}
      {categories.length > 0 && (
        <div className="mb-6">
          <CategoryFilter
            options={categories.map((c) => ({ id: c.id, label: c.title }))}
            paramName="category"
            allLabel="All Books"
          />
        </div>
      )}

      {books.length === 0 ? (
        <EmptyState icon="book" title="No books found" description="Books will be added soon." />
      ) : (
        <>
          {featured.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">⭐ Top Picks</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {featured.map((book) => (
                  <Link
                    key={book.id}
                    href={`/books/${book.id}`}
                    className="card group flex gap-4 p-4"
                  >
                    <div className="w-20 shrink-0 aspect-[3/4] rounded-lg overflow-hidden bg-primary-50 dark:bg-primary-950 flex items-center justify-center">
                      {book.cover_image ? (
                        <Image
                          src={book.cover_image}
                          alt={book.title}
                          width={80}
                          height={107}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <Library className="w-8 h-8 text-primary-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col gap-2">
                      <Badge variant="primary" size="sm">Featured</Badge>
                      <h2 className="font-semibold text-text-primary group-hover:text-primary-600 transition-colors line-clamp-2 leading-snug">
                        {book.title}
                      </h2>
                      <p className="text-sm text-text-muted">{book.author}</p>
                      <p className="text-xs text-text-muted">{book.language}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {(category ? books : rest).map((book) => (
              <Link
                key={book.id}
                href={`/books/${book.id}`}
                className="card group flex flex-col p-4 gap-3"
              >
                <div className="aspect-[3/4] rounded-lg overflow-hidden bg-primary-50 dark:bg-primary-950 flex items-center justify-center">
                  {book.cover_image ? (
                    <Image
                      src={book.cover_image}
                      alt={book.title}
                      width={150}
                      height={200}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <Library className="w-8 h-8 text-primary-300" />
                  )}
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-text-primary group-hover:text-primary-600 transition-colors line-clamp-2 leading-snug">
                    {book.title}
                  </h2>
                  <p className="text-xs text-text-muted mt-1">{book.author}</p>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
