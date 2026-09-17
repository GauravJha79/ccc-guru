import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import {
  ArrowRight,
  BookOpen,
  Clock,
  Star,
  Users,
  Award,
  TrendingUp,
  CheckCircle,
  Smartphone,
  ChevronDown,
  FlaskConical,
  FileText,
  Library,
  GraduationCap,
  BookMinus,
  NotebookPen,
  NotebookText,
} from "lucide-react";
import {
  getTestCategories,
  getTestSeries,
  getPopularTestItems,
} from "@/lib/data/tests";
import { getNotes } from "@/lib/data/notes";
import { getBlogs } from "@/lib/data/blogs";
import { getBooks } from "@/lib/data/books";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { formatDate, formatPrice } from "@/lib/utils";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "CCC Guru — Free NIELIT CCC Exam Preparation",
  description:
    "Prepare for NIELIT CCC exam with free bilingual mock tests, study notes, expert blogs and recommended books. Trusted by thousands of CCC aspirants across India.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "CCC Guru — Free NIELIT CCC Exam Preparation",
    description:
      "Free bilingual mock tests, study notes, expert blogs and books for NIELIT CCC exam.",
    url: "/",
  },
};

// Organization JSON-LD
const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "CCC Guru",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://cccguru.in",
  description: "India's trusted NIELIT CCC exam preparation platform.",
  contactPoint: {
    "@type": "ContactPoint",
    email: "hello@cccguru.in",
    contactType: "customer support",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "CCC Guru",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://cccguru.in",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://cccguru.in"}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const BENEFITS = [
  {
    icon: FlaskConical,
    title: "Bilingual Mock Tests",
    desc: "Practice in Hindi & English exactly like the real CCC exam.",
  },
  {
    icon: FileText,
    title: "Expert Study Notes",
    desc: "Concise, chapter-wise PDF notes for quick revision.",
  },
  {
    icon: GraduationCap,
    title: "Complete Syllabus",
    desc: "Full CCC syllabus coverage from basics to advanced topics.",
  },
  {
    icon: Award,
    title: "Track Progress",
    desc: "Detailed score analysis and performance reports.",
  },
  {
    icon: TrendingUp,
    title: "Regular Updates",
    desc: "Content updated as per latest NIELIT CCC pattern.",
  },
  {
    icon: Smartphone,
    title: "Mobile App",
    desc: "Study anytime, anywhere with our Android & iOS app.",
  },
];

const FAQS = [
  {
    q: "What is the CCC exam?",
    a: "CCC (Course on Computer Concepts) is a computer literacy certificate course conducted by NIELIT (National Institute of Electronics and Information Technology). It is recognized by the Government of India for various government jobs.",
  },
  {
    q: "What is the CCC exam pattern?",
    a: "The CCC exam consists of 100 objective type questions (MCQ) to be answered in 90 minutes. Questions are available in both English and Hindi. Each correct answer gives 1 mark and there is no negative marking.",
  },
  {
    q: "What is the passing marks for CCC?",
    a: "Candidates need to score at least 50 marks out of 100 (50%) to pass the CCC exam. Grade A = 85+, Grade B = 75-84, Grade C = 65-74, Grade D = 55-64, Grade E (Pass) = 50-54.",
  },
  {
    q: "Is CCC exam online or offline?",
    a: "CCC exam is conducted online (Computer Based Test) at NIELIT authorized exam centers. The exam is held every month across India.",
  },
  {
    q: "How to prepare for CCC exam?",
    a: "Practice daily with mock tests, read chapter-wise notes, and focus on topics like MS Office, Internet, Operating Systems, and basic computer concepts. CCC Guru provides all these resources for free.",
  },
];

export default async function HomePage() {
  const [categories, featuredSeries, popularItems, notes, blogs, books] =
    await Promise.all([
      getTestCategories(),
      getTestSeries({ featuredOnly: true, limit: 4 }),
      getPopularTestItems(6),
      getNotes({ limit: 4 }),
      getBlogs({ limit: 3 }),
      getBooks({ featuredOnly: true, limit: 4 }),
    ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />

      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden py-16 md:py-24"
        style={{
          background:
            "linear-gradient(135deg, #21025a 0%, #380a87 40%, #0e77c5 100%)",
        }}
        aria-label="Hero"
      >
        {/* Decorative blobs */}
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-25 pointer-events-none"
          style={{
            background: "radial-gradient(circle, #1a8fe3, transparent)",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{
            background: "radial-gradient(circle, #6610f2, transparent)",
          }}
          aria-hidden="true"
        />

        <div className="container-page relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-6">
              <span className="badge bg-primary-900 text-primary-300 border border-primary-800">
                🎓 NIELIT CCC Exam Preparation
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-5">
              Crack CCC Exam with{" "}
              <span className="gradient-text">Confidence</span>
            </h1>

            <p className="text-lg text-primary-200 mb-8 max-w-xl leading-relaxed">
              Free bilingual mock tests, expert study notes, latest blogs and
              recommended books — everything you need to ace the NIELIT CCC
              exam.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/tests" className="btn-primary text-base px-6 py-3">
                <FlaskConical className="w-5 h-5" />
                Start CCC Online Test
              </Link>
              <Link
                href="/notes"
                className="btn-secondary2 text-base px-6 py-3 border-primary-600 text-primary-300 hover:bg-primary-900"
              >
                <FileText className="w-5 h-5" />
                Study Notes
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-6 mt-10 text-sm text-primary-300">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> Free
                Forever
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> Hindi &
                English
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> No
                Registration
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Test Categories ── */}
      {categories.length > 0 && (
        <section className="py-12" aria-labelledby="categories-heading">
          <div className="container-page">
            <div className="flex items-center justify-between mb-6">
              <h2 id="categories-heading" className="section-heading">
                Test Categories
              </h2>
              <Link href="/tests" className="btn-ghost text-sm">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/tests?category=${cat.id}`}
                  className="card p-4 flex flex-col items-center gap-2 text-center hover:border-primary-400 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950 flex items-center justify-center">
                    <BookMinus className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <span className="text-sm font-medium text-text-primary leading-tight">
                    {cat.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Featured Test Series ── */}
      {featuredSeries.length > 0 && (
        <section
          className="py-12 bg-bg-subtle"
          aria-labelledby="featured-series-heading"
        >
          <div className="container-page">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 id="featured-series-heading" className="section-heading">
                  Featured CCC Online Test Series
                </h2>
                <p className="text-sm text-text-muted mt-1">
                  Practice comprehensive bilingual CCC online mock tests
                </p>
              </div>
              <Link href="/tests" className="hidden sm:flex btn-ghost text-sm">
                All Online Tests <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredSeries.map((series) => (
                <Link
                  key={series.id}
                  href={`/test-series/${series.id}`}
                  className="card p-5 flex flex-col gap-3 group"
                >
                  {series.featured_tag && (
                    <Badge variant="primary" size="sm">
                      {series.featured_tag}
                    </Badge>
                  )}
                  <h3 className="font-semibold text-text-primary group-hover:text-primary-600 transition-colors leading-snug">
                    {series.title}
                  </h3>
                  {series.featured_short_desc && (
                    <p className="text-xs text-text-muted line-clamp-2">
                      {series.featured_short_desc}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-auto pt-2">
                    <div className="flex items-center gap-1.5 text-xs text-text-muted">
                      <NotebookText className="w-3.5 h-3.5" />
                      {series.total_sets_available} Sets
                    </div>
                    <Badge
                      variant={series.is_paid ? "warning" : "success"}
                      size="sm"
                    >
                      {series.is_paid ? formatPrice(series.price) : "Free"}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Popular Tests ── */}
      {popularItems.length > 0 && (
        <section className="py-12" aria-labelledby="popular-tests-heading">
          <div className="container-page">
            <div className="flex items-center justify-between mb-6">
              <h2 id="popular-tests-heading" className="section-heading">
                Popular Tests
              </h2>
              <Link href="/tests" className="btn-ghost text-sm">
                All Tests <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularItems.map((item) => (
                <div key={item.id} className="card p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950 flex items-center justify-center shrink-0">
                    <NotebookPen className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-text-primary truncate">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-text-muted flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {item.duration}m
                      </span>
                      <span className="text-xs text-text-muted">
                        {item.question_count} Qs
                      </span>
                      <Badge
                        variant={
                          item.difficulty === "Easy"
                            ? "success"
                            : item.difficulty === "Hard"
                              ? "danger"
                              : "warning"
                        }
                        size="sm"
                      >
                        {item.difficulty}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CCC Notes ── */}
      <section className="py-12 bg-bg-subtle" aria-labelledby="notes-heading">
        <div className="container-page">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 id="notes-heading" className="section-heading">
                CCC Study Notes
              </h2>
              <p className="text-sm text-text-muted mt-1">
                Download free PDF notes for CCC preparation
              </p>
            </div>
            <Link href="/notes" className="hidden sm:flex btn-ghost text-sm">
              All Notes <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {notes.length === 0 ? (
            <EmptyState
              icon="note"
              title="Notes coming soon"
              description="Study notes will be available here shortly."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {notes.map((note) => (
                <Link
                  key={note.id}
                  href={`/notes/${note.id}`}
                  className="card p-4 flex flex-col gap-3 group"
                >
                  <div className="aspect-video rounded-lg bg-primary-50 dark:bg-primary-950 flex items-center justify-center overflow-hidden">
                    {note.thumbnail_url ? (
                      <Image
                        src={note.thumbnail_url}
                        alt={note.title}
                        width={200}
                        height={112}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <FileText className="w-10 h-10 text-primary-300" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary group-hover:text-primary-600 transition-colors line-clamp-2">
                      {note.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs text-text-muted">
                        {note.page_count} pages
                      </span>
                      {note.is_featured && (
                        <Badge variant="primary" size="sm">
                          Featured
                        </Badge>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Latest Blogs ── */}
      <section className="py-12" aria-labelledby="blogs-heading">
        <div className="container-page">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 id="blogs-heading" className="section-heading">
                Latest Articles
              </h2>
              <p className="text-sm text-text-muted mt-1">
                Expert tips, exam updates and CCC guides
              </p>
            </div>
            <Link href="/blogs" className="hidden sm:flex btn-ghost text-sm">
              All Blogs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {blogs.length === 0 ? (
            <EmptyState
              icon="book"
              title="Blogs coming soon"
              description="Articles and guides will be available here shortly."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {blogs.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/blogs/${blog.slug}`}
                  className="card group flex flex-col overflow-hidden"
                >
                  {blog.featured_image && (
                    <div className="aspect-video overflow-hidden bg-border-subtle">
                      <Image
                        src={blog.featured_image}
                        alt={blog.title_en}
                        width={400}
                        height={225}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-5 flex flex-col flex-1 gap-2">
                    {blog.blog_categories && (
                      <Badge variant="primary" size="sm">
                        {blog.blog_categories.title}
                      </Badge>
                    )}
                    <h3 className="font-semibold text-text-primary group-hover:text-primary-600 transition-colors line-clamp-2 leading-snug">
                      {blog.title_en}
                    </h3>
                    {blog.summary_en && (
                      <p className="text-sm text-text-muted line-clamp-2">
                        {blog.summary_en}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-auto pt-2 text-xs text-text-muted">
                      <span>{blog.author}</span>
                      {blog.published_at && (
                        <>
                          <span>·</span>
                          <span>{formatDate(blog.published_at)}</span>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Recommended Books ── */}
      {books.length > 0 && (
        <section className="py-12 bg-bg-subtle" aria-labelledby="books-heading">
          <div className="container-page">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 id="books-heading" className="section-heading">
                  Recommended Books
                </h2>
                <p className="text-sm text-text-muted mt-1">
                  Top CCC books recommended by experts
                </p>
              </div>
              <Link href="/books" className="hidden sm:flex btn-ghost text-sm">
                All Books <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {books.map((book) => (
                <Link
                  key={book.id}
                  href={`/books/${book.id}`}
                  className="card p-4 flex flex-col gap-3 group"
                >
                  <div className="aspect-[3/4] rounded-lg bg-primary-50 dark:bg-primary-950 flex items-center justify-center overflow-hidden">
                    {book.cover_image ? (
                      <Image
                        src={book.cover_image}
                        alt={book.title}
                        width={150}
                        height={200}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <Library className="w-10 h-10 text-primary-300" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary group-hover:text-primary-600 transition-colors line-clamp-2 leading-snug">
                      {book.title}
                    </h3>
                    <p className="text-xs text-text-muted mt-1">
                      {book.author}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Benefits ── */}
      <section className="py-12" aria-labelledby="benefits-heading">
        <div className="container-page">
          <div className="text-center mb-10">
            <h2 id="benefits-heading" className="section-heading">
              Why Choose CCC Guru?
            </h2>
            <p className="text-text-muted mt-3 max-w-xl mx-auto">
              Everything you need to pass the NIELIT CCC exam, completely free.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {BENEFITS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-5 flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary mb-1">
                    {title}
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-12 bg-bg-subtle" aria-labelledby="faq-heading">
        <div className="container-page">
          <div className="text-center mb-10">
            <h2 id="faq-heading" className="section-heading">
              Frequently Asked Questions
            </h2>
            <p className="text-text-muted mt-3">
              Everything you need to know about the CCC exam
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-3">
            {FAQS.map(({ q, a }, index) => (
              <details key={index} className="card group" name="faq">
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                  <h3 className="font-medium text-text-primary pr-4">{q}</h3>
                  <ChevronDown className="w-4 h-4 text-text-muted shrink-0 group-open:rotate-180 transition-transform duration-200" />
                </summary>
                <div className="px-5 pb-5">
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {a}
                  </p>
                </div>
              </details>
            ))}
          </div>

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: FAQS.map(({ q, a }) => ({
                  "@type": "Question",
                  name: q,
                  acceptedAnswer: { "@type": "Answer", text: a },
                })),
              }),
            }}
          />
        </div>
      </section>

      {/* ── App Download CTA ── */}
      <section
        className="py-16"
        style={{
          background:
            "linear-gradient(135deg, #380a87 0%, #6610f2 50%, #1a8fe3 100%)",
        }}
        aria-labelledby="download-heading"
      >
        <div className="container-page text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-5">
            <Smartphone className="w-8 h-8 text-white" />
          </div>
          <h2
            id="download-heading"
            className="text-3xl font-bold text-white mb-3"
          >
            Study on the Go
          </h2>
          <p className="text-primary-200 mb-7 max-w-md mx-auto">
            Download the CCC Guru app and practice mock tests anytime, anywhere
            — even offline.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="#"
              className="inline-flex items-center gap-2 bg-white text-primary-900 font-semibold px-5 py-3 rounded-lg hover:bg-primary-50 transition-colors text-sm"
            >
              📱 Download for Android
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 bg-white/10 text-white font-semibold px-5 py-3 rounded-lg border border-white/20 hover:bg-white/20 transition-colors text-sm"
            >
              🍎 Download for iOS
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
