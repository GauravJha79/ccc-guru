import { notFound } from 'next/navigation';
import { getTestSeriesItemById, getTestQuestions } from '@/lib/data/tests';
import { ExamInterface } from '@/components/tests/ExamInterface';

interface ExamPageProps {
  params: Promise<{ id: string; itemId: string }>;
}

export default async function ExamPage({ params }: ExamPageProps) {
  const { id, itemId } = await params;

  const [item, questions] = await Promise.all([
    getTestSeriesItemById(itemId),
    getTestQuestions(itemId),
  ]);

  if (!item) notFound();

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
      seriesId={id}
    />
  );
}
