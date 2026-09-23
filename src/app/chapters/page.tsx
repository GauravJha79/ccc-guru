import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, ChevronRight, GraduationCap, Laptop } from 'lucide-react';
import { getChapters, getChapterSlug } from '@/lib/data/chapters';
import { EmptyState } from '@/components/ui/EmptyState';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { siteUrl } from '@/lib/utils';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'CCC Chapters 2026 — Complete NIELIT CCC Syllabus Topics | CCC Guru',
  description:
    'Explore all NIELIT CCC exam chapters. Study chapter-wise topics, computer fundamentals, LibreOffice Writer, Calc, Impress, cyber security, and online tests in Hindi and English.',
  alternates: { canonical: 'https://www.cccguru.in/chapters' },
  openGraph: {
    title: 'CCC Chapters 2026 — Complete NIELIT CCC Syllabus Topics | CCC Guru',
    description:
      'All NIELIT CCC exam chapters in Hindi and English with chapter-wise tests and notes.',
    url: 'https://www.cccguru.in/chapters',
  },
};

export default async function ChaptersPage() {
  const chapters = await getChapters();

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: 'Chapters' }]} />

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
          CCC Exam Chapters (2026 Syllabus)
        </h1>
        <p className="text-text-secondary max-w-2xl leading-relaxed">
          Complete chapter-wise coverage of the official NIELIT CCC revised syllabus.
          Select any chapter to study important topics in English &amp; Hindi, review key concepts, and practice chapter-wise tests.
        </p>
      </div>

      {chapters.length === 0 ? (
        <EmptyState
          icon="book"
          title="No chapters available"
          description="Chapter content will be added soon."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {chapters.map((chapter, index) => {
            const slug = getChapterSlug(chapter);
            return (
              <Link
                key={chapter.id}
                href={`/chapters/${slug}`}
                className="card p-5 flex items-start gap-4 group hover:border-primary-400 dark:hover:border-primary-600 transition-all shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950 flex items-center justify-center text-sm font-bold text-primary-600 dark:text-primary-400 group-hover:bg-primary-600 group-hover:text-white transition-all shrink-0">
                  {chapter.sort_order || index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-text-primary group-hover:text-primary-600 transition-colors line-clamp-2 leading-snug text-base">
                    {chapter.title}
                  </h2>
                  {chapter.hindi_title && chapter.hindi_title !== chapter.title && (
                    <p className="text-xs text-text-muted mt-1 line-clamp-1" lang="hi">
                      {chapter.hindi_title}
                    </p>
                  )}
                  {chapter.description && (
                    <p className="text-xs text-text-muted mt-1.5 line-clamp-2 leading-relaxed">
                      {chapter.description}
                    </p>
                  )}
                  <span className="text-[11px] font-semibold text-primary-600 dark:text-primary-400 mt-2.5 inline-flex items-center gap-1">
                    Study Topics &amp; Test →
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
              </Link>
            );
          })}
        </div>
      )}

      {/* Cross-linking to Syllabus and Mock Tests */}
      <div className="card p-6 sm:p-8 rounded-2xl bg-surface border border-border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg text-text-primary mb-1">
              Looking for the full syllabus and mock exams?
            </h3>
            <p className="text-sm text-text-muted">
              Check out the official 10-module curriculum or take a full 100-question mock test.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/ccc-syllabus" className="btn-secondary text-sm">
              <GraduationCap className="w-4 h-4" />
              CCC Syllabus
            </Link>
            <Link href="/tests" className="btn-primary text-sm">
              <Laptop className="w-4 h-4" />
              Online Mock Tests
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
