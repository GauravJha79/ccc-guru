import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Clock, FileQuestion, BarChart3, AlertTriangle,
  CheckCircle, ChevronLeft, Play
} from 'lucide-react';
import { getTestSeriesById, getTestSeriesItemById } from '@/lib/data/tests';
import { Badge } from '@/components/ui/Badge';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { getDifficultyColor } from '@/lib/utils';

interface TestSetPageProps {
  params: Promise<{ id: string; itemId: string }>;
}

export async function generateMetadata({ params }: TestSetPageProps): Promise<Metadata> {
  const { id, itemId } = await params;
  const item = await getTestSeriesItemById(itemId);
  if (!item) return { title: 'Test Not Found' };
  return {
    title: item.title,
    description: `${item.question_count} questions · ${item.duration} minutes · ${item.difficulty}. Start your CCC practice test now.`,
    alternates: { canonical: `/test-series/${id}/${itemId}` },
    robots: { index: false }, // Don't index individual test instruction pages
  };
}

const INSTRUCTIONS = [
  'The test contains multiple choice questions (MCQ).',
  'Each question has 4 options — select the most appropriate answer.',
  'Questions are available in both English and Hindi.',
  'You can navigate between questions freely using the question panel.',
  'You can flag questions to review them later.',
  'The timer will start as soon as you click "Start Test".',
  'The test will auto-submit when the time is up.',
  'Once submitted, the test cannot be re-opened.',
  'Do NOT refresh or close the browser during the test.',
];

export default async function TestSetPage({ params }: TestSetPageProps) {
  const { id, itemId } = await params;
  const [series, item] = await Promise.all([
    getTestSeriesById(id),
    getTestSeriesItemById(itemId),
  ]);

  if (!item || !series) notFound();

  return (
    <div className="container-page py-8 max-w-3xl">
      <Breadcrumbs
        items={[
          { label: 'Tests', href: '/tests' },
          { label: series.title, href: `/test-series/${id}` },
          { label: item.title },
        ]}
      />

      <div className="card-elevated rounded-xl p-6 md:p-8 mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge
            variant={item.difficulty === 'Easy' ? 'success' : item.difficulty === 'Hard' ? 'danger' : 'warning'}
          >
            {item.difficulty}
          </Badge>
          <Badge variant="outline">{item.test_type}</Badge>
          {item.negative_marking_enabled && (
            <Badge variant="danger">Negative Marking</Badge>
          )}
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-5">
          {item.title}
        </h1>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Questions', value: item.question_count, icon: FileQuestion },
            { label: 'Duration', value: `${item.duration} min`, icon: Clock },
            { label: 'Total Marks', value: item.total_marks, icon: BarChart3 },
            {
              label: 'Negative Marks',
              value: item.negative_marking_enabled ? `-${item.negative_marks}` : 'None',
              icon: AlertTriangle,
            },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="card p-4 flex flex-col items-center gap-2 text-center">
              <Icon className="w-5 h-5 text-primary-500" />
              <span className="text-xl font-bold text-text-primary">{value}</span>
              <span className="text-xs text-text-muted">{label}</span>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div
          className="rounded-xl p-5 mb-6"
          style={{ backgroundColor: 'rgb(var(--color-bg-subtle))' }}
        >
          <h2 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Test Instructions
          </h2>
          <ul className="space-y-2">
            {INSTRUCTIONS.map((instruction, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                {instruction}
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={`/test-series/${id}/${itemId}/exam`}
            className="btn-primary flex-1 justify-center py-3 text-base"
            id="start-test-btn"
          >
            <Play className="w-5 h-5" />
            Start Test
          </Link>
          <Link
            href={`/test-series/${id}`}
            className="btn-secondary flex-1 justify-center py-3"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Series
          </Link>
        </div>
      </div>
    </div>
  );
}
