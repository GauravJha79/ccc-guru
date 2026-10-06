import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, GraduationCap, Laptop, FlaskConical, Clock } from 'lucide-react';
import { getChapters, getChapterSlug } from '@/lib/data/chapters';
import { getChapterTestInfo } from '@/lib/data/tests';
import { EmptyState } from '@/components/ui/EmptyState';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'CCC Chapters 2026 — Complete NIELIT CCC Syllabus Topics & Tests | CCC Guru',
  description:
    'Explore all NIELIT CCC exam chapters. Practice chapter-wise 100-question online tests, computer fundamentals, LibreOffice Writer, Calc, Impress, cyber security in Hindi and English.',
  alternates: { canonical: 'https://www.cccguru.in/chapters' },
  openGraph: {
    title: 'CCC Chapters 2026 — Complete NIELIT CCC Syllabus Topics & Tests | CCC Guru',
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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 border border-primary-200/60 dark:border-primary-800/60 mb-3">
          <FlaskConical className="w-3.5 h-3.5 text-primary-600" />
          <span>Chapter-Wise Online Tests &amp; Syllabus 2026</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-text-primary mb-3">
          CCC Exam Chapters (2026 Syllabus)
        </h1>
        <p className="text-text-secondary max-w-2xl leading-relaxed text-sm sm:text-base">
          Complete chapter-wise coverage of the official NIELIT CCC revised syllabus.
          Take dedicated 100-question chapter tests in Hindi &amp; English, or review key study notes and concepts.
        </p>
      </div>

      {chapters.length === 0 ? (
        <EmptyState
          icon="book"
          title="No chapters available"
          description="Chapter content will be added soon."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {chapters.map((chapter, index) => {
            const slug = getChapterSlug(chapter);
            const testInfo = getChapterTestInfo(chapter.sort_order || index + 1);

            return (
              <div
                key={chapter.id}
                className="card p-5 sm:p-6 flex flex-col justify-between group hover:border-primary-400 dark:hover:border-primary-600 transition-all shadow-sm rounded-2xl bg-surface border border-border"
              >
                <div>
                  {/* Header Row: Chapter Number + Test Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3.5">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 font-bold text-xs">
                      <span>Chapter {(chapter.sort_order || index + 1) < 10 ? `0${chapter.sort_order || index + 1}` : chapter.sort_order || index + 1}</span>
                    </div>

                    {testInfo && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-text-muted bg-surface-elevated px-2 py-0.5 rounded-md border border-border">
                        <Clock className="w-3 h-3 text-primary-500" />
                        <span>{testInfo.questionCount} Qs • {testInfo.duration}m</span>
                      </span>
                    )}
                  </div>

                  {/* Title linking to study notes */}
                  <Link
                    href={`/chapters/${slug}`}
                    className="block group-hover:text-primary transition-colors mb-1.5"
                  >
                    <h2 className="font-bold text-text-primary group-hover:text-primary text-base sm:text-lg leading-snug line-clamp-2">
                      {chapter.title}
                    </h2>
                  </Link>

                  {/* Hindi Title */}
                  {chapter.hindi_title && chapter.hindi_title !== chapter.title && (
                    <p className="text-xs sm:text-sm font-medium text-text-secondary mb-2 line-clamp-1" lang="hi">
                      {chapter.hindi_title}
                    </p>
                  )}

                  {/* Description */}
                  {chapter.description && (
                    <p className="text-xs text-text-muted line-clamp-2 leading-relaxed mb-4">
                      {chapter.description}
                    </p>
                  )}
                </div>

                {/* Actions: Take Chapter Test (Direct) & Study Notes */}
                <div className="pt-3.5 border-t border-border/70 flex items-center gap-2 mt-auto">
                  {testInfo && (
                    <Link
                      href={testInfo.testUrl}
                      className="btn-primary text-xs py-2 px-3 flex-1 flex items-center justify-center gap-1.5 font-semibold text-center rounded-xl shadow-xs"
                      title={`Take Chapter ${chapter.sort_order || index + 1} Online Test`}
                    >
                      <FlaskConical className="w-3.5 h-3.5 shrink-0" />
                      <span>Take Chapter Test</span>
                    </Link>
                  )}
                  <Link
                    href={`/chapters/${slug}`}
                    className="btn-secondary text-xs py-2 px-3 flex items-center justify-center gap-1 text-center font-medium rounded-xl shrink-0"
                    title={`Study Chapter ${chapter.sort_order || index + 1} Topics & Notes`}
                  >
                    <BookOpen className="w-3.5 h-3.5 shrink-0" />
                    <span>Study Notes</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cross-linking to Syllabus and Mock Tests */}
      <div className="card p-6 sm:p-8 rounded-2xl bg-surface border border-border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg text-text-primary mb-1">
              Looking for the full syllabus and 100-question mock exams?
            </h3>
            <p className="text-sm text-text-muted">
              Check out the official 10-module curriculum or take full-length timed mock tests.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/ccc-syllabus" className="btn-secondary text-sm">
              <GraduationCap className="w-4 h-4" />
              CCC Syllabus
            </Link>
            <Link href="/test-series/ccc-chapter-wise-test-series-2026" className="btn-secondary text-sm">
              <FlaskConical className="w-4 h-4" />
              All Chapter Tests
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
