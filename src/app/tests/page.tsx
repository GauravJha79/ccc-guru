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

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'CCC Online Test 2025 — Free NIELIT CCC Mock Test Series (Hindi & English)',
  description:
    'Practice free CCC online test and bilingual mock test series based on the latest NIELIT CCC exam pattern. Attempt full-length 100-question practice tests with instant results and explanations.',
  keywords: [
    'CCC online test',
    'CCC online test in Hindi',
    'CCC online test 2025',
    'free CCC online test',
    'NIELIT CCC online test',
    'CCC mock test',
    'CCC online test 100 questions',
    'CCC online test 50 questions',
    'CCC exam practice test',
  ],
  alternates: { canonical: '/tests' },
  openGraph: {
    title: 'CCC Online Test 2025 — Free NIELIT CCC Mock Test Series',
    description:
      'Attempt free bilingual CCC online tests with 100 MCQs, timer, instant score and detailed solutions in Hindi & English.',
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
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
          CCC Online Test & Mock Test Series
        </h1>
        <p className="text-text-secondary max-w-3xl leading-relaxed">
          Prepare for your NIELIT CCC (Course on Computer Concepts) examination with our free{' '}
          <strong>CCC online test</strong> series. Practice bilingual mock tests in Hindi and English
          with real exam timing, question navigator, and instant answer review.
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

      {/* ── SEO Information Section: CCC Online Test ── */}
      <section className="mt-16 pt-12 border-t border-border">
        <div className="max-w-4xl">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            About NIELIT CCC Online Test & Mock Test Series
          </h2>
          <p className="text-text-secondary leading-relaxed mb-6">
            The <strong>NIELIT CCC (Course on Computer Concepts)</strong> examination is a nationwide certificate exam designed to spread basic computer literacy among students and job aspirants across India. Taking our free <strong>CCC online test</strong> series simulates the exact exam environment with timed bilingual questions (Hindi & English), instant evaluation, and detailed explanations.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="card p-4 text-center">
              <div className="text-2xl font-black text-primary-600 dark:text-primary-400">100</div>
              <div className="text-xs text-text-muted mt-1">Total Questions (MCQ)</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-2xl font-black text-primary-600 dark:text-primary-400">90 Mins</div>
              <div className="text-xs text-text-muted mt-1">Exam Duration</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">50%</div>
              <div className="text-xs text-text-muted mt-1">Passing Marks (Grade D)</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-2xl font-black text-primary-600 dark:text-primary-400">0</div>
              <div className="text-xs text-text-muted mt-1">No Negative Marking</div>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-text-primary mb-3">
            Why Practice with CCC Online Test on CCC Guru?
          </h3>
          <ul className="list-disc list-inside space-y-2 text-sm text-text-secondary mb-8 leading-relaxed">
            <li><strong>100% Free & Updated:</strong> All tests follow the latest 2024-2025 NIELIT CCC syllabus.</li>
            <li><strong>Bilingual Support:</strong> Toggle questions seamlessly between Hindi and English with automatic language preference memory.</li>
            <li><strong>Chapter-wise & Full Mock Tests:</strong> Practice topic-specific questions on LibreOffice Writer, Calc, Impress, Internet, Cyber Security, and Digital Financial Services.</li>
            <li><strong>Instant Scoring & Answer Review:</strong> Review correct answers and in-depth explanations immediately after test submission.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
