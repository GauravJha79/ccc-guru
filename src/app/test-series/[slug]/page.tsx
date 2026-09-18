import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  FlaskConical, Clock, BarChart3, Star, Users, ArrowRight,
  CheckCircle, Lock, ChevronRight, BookOpen
} from 'lucide-react';
import { getTestSeriesBySlug, getTestSeriesItems } from '@/lib/data/tests';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { formatPrice, getDifficultyColor } from '@/lib/utils';

export const dynamicParams = true;
export const revalidate = 60;

interface TestSeriesPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: TestSeriesPageProps): Promise<Metadata> {
  const { slug } = await params;
  const series = await getTestSeriesBySlug(slug);
  if (!series) return { title: 'Test Series Not Found' };

  const title = `${series.title} — Free CCC Online Test`;
  const description =
    series.description ??
    `Practice ${series.title} CCC online test with ${series.total_sets_available} bilingual mock test sets. Free NIELIT CCC online exam practice with instant solutions.`;

  return {
    title,
    description,
    keywords: [
      series.title,
      'CCC online test',
      'CCC mock test',
      'NIELIT CCC online test',
      'CCC online practice test',
      'CCC exam test series',
    ],
    alternates: { canonical: `/test-series/${series.slug}` },
    openGraph: {
      title,
      description,
      url: `/test-series/${series.slug}`,
    },
  };
}

export default async function TestSeriesPage({ params }: TestSeriesPageProps) {
  const { slug } = await params;
  const series = await getTestSeriesBySlug(slug);

  if (!series) notFound();

  const items = await getTestSeriesItems(series.id);

  const testSeriesJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: series.title,
    description: series.description ?? `Practice ${series.title} for NIELIT CCC exam.`,
    learningResourceType: 'Practice Test / Quiz',
    educationalLevel: 'NIELIT CCC Certification',
    inLanguage: ['en', 'hi'],
    isAccessibleForFree: !series.is_paid,
    provider: {
      '@type': 'Organization',
      name: 'CCC Guru',
      url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cccguru.in',
    },
    url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cccguru.in'}/test-series/${series.slug}`,
  };

  return (
    <div className="container-page py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(testSeriesJsonLd) }}
      />
      <Breadcrumbs
        items={[
          { label: 'Tests', href: '/tests' },
          { label: series.title },
        ]}
      />

      {/* Series Header */}
      <div className="card-elevated rounded-xl p-6 md:p-8 mb-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {series.is_featured && (
                <Badge variant="primary">{series.featured_tag ?? 'Featured'}</Badge>
              )}
              <Badge variant={series.is_paid ? 'warning' : 'success'}>
                {series.is_paid ? formatPrice(series.price) : 'Free'}
              </Badge>
              {series.test_categories && (
                <Badge variant="outline">{series.test_categories.title}</Badge>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-3">
              {series.title}
            </h1>

            {series.description && (
              <p className="text-text-secondary leading-relaxed mb-4">
                {series.description}
              </p>
            )}

            <div className="flex flex-wrap gap-5 text-sm text-text-secondary">
              <span className="flex items-center gap-1.5">
                <FlaskConical className="w-4 h-4 text-primary-500" />
                {series.total_sets_available} Test Sets
              </span>
              {series.total_enrolled > 0 && (
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-primary-500" />
                  {series.total_enrolled.toLocaleString()} Enrolled
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 min-w-[160px]">
            {items.length > 0 && (
              <Link
                href={`/test-series/${series.slug}/${items[0].id}`}
                className="btn-primary w-full justify-center"
              >
                Start First Test
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Test Sets List */}
      <h2 className="text-xl font-bold text-text-primary mb-4">
        Test Sets ({items.length})
      </h2>

      {items.length === 0 ? (
        <EmptyState
          icon="test"
          title="No tests published yet"
          description="Tests will be added to this series soon."
        />
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <Link
              key={item.id}
              href={`/test-series/${series.slug}/${item.id}`}
              className="card p-4 flex items-center gap-4 group"
            >
              {/* Number */}
              <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-950 flex items-center justify-center text-sm font-bold text-primary-600 dark:text-primary-400 shrink-0">
                {index + 1}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-text-primary group-hover:text-primary-600 transition-colors truncate">
                  {item.title}
                </h3>
                <div className="flex flex-wrap items-center gap-3 mt-1">
                  <span className="text-xs text-text-muted flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {item.duration} min
                  </span>
                  <span className="text-xs text-text-muted">
                    {item.question_count} Questions
                  </span>
                  <span className="text-xs text-text-muted">
                    {item.total_marks} Marks
                  </span>
                  <Badge
                    variant={item.difficulty === 'Easy' ? 'success' : item.difficulty === 'Hard' ? 'danger' : 'warning'}
                    size="sm"
                  >
                    {item.difficulty}
                  </Badge>
                  {item.negative_marking_enabled && (
                    <span className="text-xs text-red-500">
                      −{item.negative_marks} Negative
                    </span>
                  )}
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-primary-500 transition-colors shrink-0" />
            </Link>
          ))}
        </div>
      )}

      {/* Detailed Description / Markdown Guide (SEO Content) */}
      {series.description_md && (
        <section className="mt-12 pt-8 border-t border-border">
          <div className="prose-ccc max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {series.description_md}
            </ReactMarkdown>
          </div>
        </section>
      )}
    </div>
  );
}
