import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { FlaskConical, Clock, BarChart3, Star, Users } from 'lucide-react';
import { getTestCategories, getTestSeries } from '@/lib/data/tests';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { CardGridSkeleton } from '@/components/ui/Skeleton';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { CategoryFilter } from '@/components/ui/CategoryFilter';
import { formatPrice, getDifficultyColor } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'CCC Mock Tests — Free Online Test Series',
  description:
    'Practice CCC exam with free bilingual mock tests. Full-length tests, chapter tests, and topic-wise tests with detailed analysis. Start your CCC preparation now.',
  alternates: { canonical: '/tests' },
  openGraph: {
    title: 'CCC Mock Tests — Free Online Test Series',
    description: 'Free bilingual mock tests for NIELIT CCC exam with detailed analysis.',
    url: '/tests',
  },
};

interface TestsPageProps {
  searchParams: Promise<{ category?: string; q?: string }>;
}

export default async function TestsPage({ searchParams }: TestsPageProps) {
  const { category } = await searchParams;
  const [categories, series] = await Promise.all([
    getTestCategories(),
    getTestSeries({ categoryId: category }),
  ]);

  const selectedCategory = categories.find((c) => c.id === category);

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: 'Tests' }]} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          CCC Mock Tests
        </h1>
        <p className="text-text-muted">
          Practice with{' '}
          {selectedCategory ? selectedCategory.title : 'all'}{' '}
          test series — bilingual (Hindi + English)
        </p>
      </div>

      {/* Category filter */}
      {categories.length > 0 && (
        <div className="mb-6">
          <CategoryFilter
            options={categories.map((c) => ({ id: c.id, label: c.title }))}
            paramName="category"
            allLabel="All Categories"
          />
        </div>
      )}

      {/* Series grid */}
      {series.length === 0 ? (
        <EmptyState
          icon="test"
          title="No test series found"
          description={
            category
              ? 'No tests available in this category yet. Check back soon.'
              : 'No tests available yet. Check back soon.'
          }
          action={
            <Link href="/tests" className="btn-secondary">
              View All Tests
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {series.map((s) => (
            <Link
              key={s.id}
              href={`/test-series/${s.id}`}
              className="card p-5 flex flex-col gap-3 group"
            >
              {/* Header row */}
              <div className="flex items-start justify-between gap-2">
                <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950 flex items-center justify-center shrink-0">
                  <FlaskConical className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="flex items-center gap-1.5 flex-wrap justify-end">
                  {s.is_featured && (
                    <Badge variant="primary" size="sm">Featured</Badge>
                  )}
                  <Badge variant={s.is_paid ? 'warning' : 'success'} size="sm">
                    {s.is_paid ? formatPrice(s.price) : 'Free'}
                  </Badge>
                </div>
              </div>

              {/* Title */}
              <div>
                <h2 className="font-semibold text-text-primary group-hover:text-primary-600 transition-colors leading-snug">
                  {s.title}
                </h2>
                {s.description && (
                  <p className="text-xs text-text-muted mt-1 line-clamp-2">{s.description}</p>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-xs text-text-muted mt-auto pt-2 border-t border-border-subtle">
                <span className="flex items-center gap-1">
                  <FlaskConical className="w-3.5 h-3.5" />
                  {s.total_sets_available} Sets
                </span>
                {s.total_enrolled > 0 && (
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {s.total_enrolled.toLocaleString()} Enrolled
                  </span>
                )}
              </div>

              {/* CTA */}
              <div className="text-xs font-semibold text-primary-600 dark:text-primary-400 group-hover:underline">
                View Series →
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
