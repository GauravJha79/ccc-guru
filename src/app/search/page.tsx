import type { Metadata } from 'next';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { getBlogs } from '@/lib/data/blogs';
import { getNotes } from '@/lib/data/notes';
import { getBooks } from '@/lib/data/books';
import { getTestSeries } from '@/lib/data/tests';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';

export const metadata: Metadata = {
  title: 'Search — CCC Guru',
  description: 'Search tests, notes, blogs and books on CCC Guru.',
  robots: { index: false },
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? '';

  if (!query) {
    return (
      <div className="container-page py-8">
        <Breadcrumbs items={[{ label: 'Search' }]} />
        <EmptyState
          icon="search"
          title="Enter a search term"
          description="Type something in the search bar to find tests, notes, blogs, or books."
        />
      </div>
    );
  }

  const [series, notes, blogs, books] = await Promise.all([
    getTestSeries(),
    getNotes({ search: query }),
    getBlogs({ search: query }),
    getBooks({ search: query }),
  ]);

  const filteredSeries = series.filter((s) =>
    s.title.toLowerCase().includes(query.toLowerCase())
  );

  const totalResults = filteredSeries.length + notes.length + blogs.length + books.length;

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: 'Search' }]} />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary mb-1">
          Search Results for &quot;{query}&quot;
        </h1>
        <p className="text-text-muted">{totalResults} result{totalResults !== 1 ? 's' : ''} found</p>
      </div>

      {totalResults === 0 ? (
        <EmptyState
          icon="search"
          title={`No results for "${query}"`}
          description="Try different keywords or browse our content sections."
          action={
            <div className="flex gap-3">
              <Link href="/tests" className="btn-primary">View Tests</Link>
              <Link href="/blogs" className="btn-secondary">Read Blogs</Link>
            </div>
          }
        />
      ) : (
        <div className="space-y-8">
          {filteredSeries.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">Test Series</h2>
              <div className="space-y-2">
                {filteredSeries.map((s) => (
                  <Link key={s.id} href={`/test-series/${s.slug}`} className="card p-4 flex items-center gap-3 group">
                    <Badge variant={s.is_paid ? 'warning' : 'success'} size="sm">
                      {s.is_paid ? 'Paid' : 'Free'}
                    </Badge>
                    <span className="font-medium text-text-primary group-hover:text-primary-600 transition-colors">
                      {s.title}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {notes.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">Notes</h2>
              <div className="space-y-2">
                {notes.map((n) => (
                  <Link key={n.id} href={`/notes/${n.id}`} className="card p-4 flex items-center gap-3 group">
                    <Badge variant="primary" size="sm">Note</Badge>
                    <span className="font-medium text-text-primary group-hover:text-primary-600 transition-colors">
                      {n.title}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {blogs.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">Blogs</h2>
              <div className="space-y-2">
                {blogs.map((b) => (
                  <Link key={b.id} href={`/blogs/${b.slug}`} className="card p-4 flex items-center gap-3 group">
                    <Badge variant="outline" size="sm">Blog</Badge>
                    <span className="font-medium text-text-primary group-hover:text-primary-600 transition-colors">
                      {b.title_en}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {books.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">Books</h2>
              <div className="space-y-2">
                {books.map((b) => (
                  <Link key={b.id} href={`/books/${b.id}`} className="card p-4 flex items-center gap-3 group">
                    <Badge variant="success" size="sm">Book</Badge>
                    <span className="font-medium text-text-primary group-hover:text-primary-600 transition-colors">
                      {b.title}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
