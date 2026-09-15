import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, ChevronRight } from 'lucide-react';
import { getChapters } from '@/lib/data/chapters';
import { EmptyState } from '@/components/ui/EmptyState';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

export const metadata: Metadata = {
  title: 'CCC Chapters — Complete CCC Syllabus Chapters',
  description:
    'Explore all CCC exam chapters. Study chapter-wise topics for NIELIT CCC exam. Available in Hindi and English.',
  alternates: { canonical: '/chapters' },
  openGraph: {
    title: 'CCC Chapters — Complete CCC Syllabus',
    description: 'All CCC exam chapters in Hindi and English.',
    url: '/chapters',
  },
};

export default async function ChaptersPage() {
  const chapters = await getChapters();

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: 'Chapters' }]} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">CCC Chapters</h1>
        <p className="text-text-muted">
          Complete chapter-wise coverage of NIELIT CCC syllabus
        </p>
      </div>

      {chapters.length === 0 ? (
        <EmptyState
          icon="book"
          title="No chapters available"
          description="Chapter content will be added soon."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {chapters.map((chapter, index) => (
            <Link
              key={chapter.id}
              href={`/chapters/${chapter.id}`}
              className="card p-5 flex items-start gap-4 group"
            >
              <div className="w-9 h-9 rounded-lg bg-primary-50 dark:bg-primary-950 flex items-center justify-center text-sm font-bold text-primary-600 dark:text-primary-400 shrink-0">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-text-primary group-hover:text-primary-600 transition-colors line-clamp-2 leading-snug">
                  {chapter.title}
                </h2>
                {chapter.hindi_title && chapter.hindi_title !== chapter.title && (
                  <p className="text-sm text-text-muted mt-0.5 line-clamp-1" lang="hi">
                    {chapter.hindi_title}
                  </p>
                )}
                {chapter.description && (
                  <p className="text-xs text-text-muted mt-1.5 line-clamp-2">
                    {chapter.description}
                  </p>
                )}
              </div>
              <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-primary-500 transition-colors shrink-0 mt-0.5" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
