import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTestSeriesItemById, getTestQuestions } from '@/lib/data/tests';
import { getChapters } from '@/lib/data/chapters';
import { ExamInterface } from '@/components/tests/ExamInterface';

export const metadata: Metadata = {
  title: 'Live CCC Practice Test | CCC Guru',
  robots: {
    index: false,
    follow: false,
  },
};

interface ExamPageProps {
  params: Promise<{ slug: string; itemId: string }>;
}

export default async function ExamPage({ params }: ExamPageProps) {
  const { slug, itemId } = await params;

  // Resolve item first (supports both slug and UUID)
  const item = await getTestSeriesItemById(itemId);
  if (!item) notFound();

  // Fetch questions using the canonical item ID (UUID)
  const [questions, chapters] = await Promise.all([
    getTestQuestions(item.id),
    getChapters(),
  ]);

  const activeQuestions = questions.filter((q) => q.is_active);

  if (activeQuestions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-text-primary mb-2">
            No Questions Available
          </h1>
          <p className="text-text-muted">
            This test has no questions yet. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ExamInterface
      item={item}
      questions={activeQuestions}
      seriesSlug={slug}
      chapters={chapters}
    />
  );
}
