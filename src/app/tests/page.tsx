import type { Metadata } from 'next';
import Link from 'next/link';
import {
  FlaskConical,
  Clock,
  BarChart3,
  Award,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  BookOpen,
  FileQuestion,
  Languages,
  Laptop,
  GraduationCap,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import {
  getTestCategories,
  getTestSeries,
  getPopularTestItems,
} from '@/lib/data/tests';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { CategoryFilter } from '@/components/ui/CategoryFilter';
import { TestSeriesCard } from '@/components/tests/TestSeriesCard';
import { siteUrl } from '@/lib/utils';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'CCC Online Test 2026 – Free NIELIT Mock Tests in Hindi & English | CCC Guru',
  description:
    'Practice CCC Online Test 2026 with free NIELIT mock tests in Hindi and English. Attempt 100-question full mocks, chapter-wise tests, timed practice and instant results.',
  alternates: { canonical: 'https://www.cccguru.in/tests' },
  openGraph: {
    title: 'CCC Online Test 2026 – Free NIELIT Mock Tests in Hindi & English | CCC Guru',
    description:
      'Practice CCC Online Test 2026 with free NIELIT mock tests in Hindi and English. Attempt 100-question full mocks, chapter-wise tests, timed practice and instant results.',
    url: 'https://www.cccguru.in/tests',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CCC Online Test 2026 – Free NIELIT Mock Tests in Hindi & English | CCC Guru',
    description:
      'Practice CCC Online Test 2026 with free NIELIT mock tests in Hindi and English. Attempt 100-question full mocks, chapter-wise tests, timed practice and instant results.',
  },
};

const TEST_FAQS = [
  {
    q: 'How many questions are there in the CCC Online Test 2026?',
    a: 'Each full-length CCC mock test contains exactly 100 questions (objective MCQs and True/False) to be completed in 90 minutes, matching the official NIELIT exam pattern.',
  },
  {
    q: 'Is the CCC Online Test available in Hindi and English?',
    a: 'Yes. Every CCC practice test on CCC Guru is fully bilingual. You can switch between Hindi and English at any time during your practice test session.',
  },
  {
    q: 'Is there any negative marking in the CCC Mock Test?',
    a: 'No. The NIELIT CCC exam has no negative marking. Each correct question awards 1 mark, while unattempted or incorrect answers receive 0 marks.',
  },
  {
    q: 'What are the qualifying marks and grading system for CCC?',
    a: 'Candidates need a minimum of 50 marks out of 100 (50%) to pass. The official NIELIT grading scale is: Grade S (85% and above), Grade A (75%–84%), Grade B (65%–74%), Grade C (55%–64%), Grade D (50%–54% - Pass), and Grade F (Below 50% - Fail).',
  },
  {
    q: 'What is the difference between CCC Full Mock Test and Chapter Wise Test?',
    a: 'A CCC full mock test simulates the complete 100-question final exam across all syllabus modules. A CCC chapter wise test concentrates exclusively on individual topics like LibreOffice Writer, Calc, Impress, Internet, or Cyber Security to master specific areas.',
  },
  {
    q: 'Are the questions based on LibreOffice or MS Office?',
    a: 'All questions on CCC Guru follow the latest NIELIT Revision 4 syllabus, which focuses on LibreOffice (Writer, Calc, Impress) along with open-source and digital financial tools.',
  },
];

interface TestsPageProps {
  searchParams: Promise<{ category?: string; q?: string }>;
}

export default async function TestsPage({ searchParams }: TestsPageProps) {
  const { category } = await searchParams;
  const [categories, series, popularItems] = await Promise.all([
    getTestCategories(),
    getTestSeries({ categoryId: category }),
    getPopularTestItems(6),
  ]);

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: 'Tests' }]} />

      {/* ── Page Header ── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 border border-primary-200/60 dark:border-primary-800/60">
            <Sparkles className="w-3.5 h-3.5" />
            NIELIT CCC Exam Pattern 2026
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
            100% Free Practice
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-text-primary mb-3 leading-tight">
          CCC Online Test 2026 – Free NIELIT Mock Test
        </h1>
        <p className="text-text-secondary max-w-3xl leading-relaxed text-base md:text-lg">
          Practice <strong>CCC Online Test 2026</strong> with free NIELIT mock tests in Hindi and English.
          Attempt 100-question full mocks, chapter-wise tests, timed practice and instant results to pass your
          CCC certification with top grades.
        </p>
      </div>

      {/* ── Category Filter ── */}
      {categories.length > 0 && (
        <div className="mb-8">
          <CategoryFilter
            options={categories.map((c) => ({ id: c.id, label: c.title }))}
            paramName="category"
            allLabel="All Test Series"
          />
        </div>
      )}

      {/* ── Test Series Grid ── */}
      <div className="mb-12">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
              Available CCC Test Series (2026)
            </h2>
            <p className="text-xs sm:text-sm text-text-muted mt-0.5">
              Select a series to practice full-length mock tests or chapter-specific tests.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 border border-primary-200/50 dark:border-primary-800/50">
            {series.length} {series.length === 1 ? 'Series' : 'Series Available'}
          </span>
        </div>

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {series.map((s, idx) => (
              <TestSeriesCard key={s.id} series={s} priority={idx < 6} />
            ))}
          </div>
        )}
      </div>

      {/* ── Popular Tests Shortcut ── */}
      {popularItems.length > 0 && (
        <section className="mb-14 p-6 sm:p-8 rounded-2xl bg-surface border border-border">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-text-primary">
                Popular CCC Practice Tests
              </h2>
              <p className="text-xs sm:text-sm text-text-muted mt-0.5">
                Most attempted full mock test sets and chapter tests by students
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularItems.map((item) => (
              <Link
                key={item.id}
                href={`/test-series/${item.test_series?.slug || item.series_id}/${item.id}`}
                className="card p-4 flex items-center gap-4 group hover:border-primary-400 dark:hover:border-primary-600 transition-all shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform text-primary-600 dark:text-primary-400">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-text-primary group-hover:text-primary-600 transition-colors truncate">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-text-muted flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {item.duration}m
                    </span>
                    <span className="text-xs text-text-muted font-medium">
                      {item.question_count} Qs
                    </span>
                    <Badge
                      variant={
                        item.difficulty === 'Easy'
                          ? 'success'
                          : item.difficulty === 'Hard'
                            ? 'danger'
                            : 'warning'
                      }
                      size="sm"
                    >
                      {item.difficulty}
                    </Badge>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-primary-600 group-hover:translate-x-1 transition-all shrink-0" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Comprehensive SEO Guide Section ── */}
      <section className="mt-12 pt-10 border-t border-border">
        <div className="max-w-4xl space-y-12">
          {/* Quick Exam Overview Cards */}
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-3">
              CCC Exam Pattern 2026 &amp; Online Test Structure
            </h2>
            <p className="text-text-secondary leading-relaxed mb-6 text-sm sm:text-base">
              The <strong>NIELIT CCC (Course on Computer Concepts)</strong> examination is a computer-based online test (CBT) designed to assess basic computer literacy for government examinations and employment across India. Our <strong>CCC online test</strong> platform is structured exactly as per the current NIELIT exam blueprint.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="card p-4 text-center">
                <div className="text-2xl font-black text-primary-600 dark:text-primary-400">100</div>
                <div className="text-xs text-text-muted mt-1">CCC 100 Questions (MCQ)</div>
              </div>
              <div className="card p-4 text-center">
                <div className="text-2xl font-black text-primary-600 dark:text-primary-400">90 Mins</div>
                <div className="text-xs text-text-muted mt-1">Exam Duration</div>
              </div>
              <div className="card p-4 text-center">
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">50%</div>
                <div className="text-xs text-text-muted mt-1">Qualifying Mark (Grade D)</div>
              </div>
              <div className="card p-4 text-center">
                <div className="text-2xl font-black text-primary-600 dark:text-primary-400">0</div>
                <div className="text-xs text-text-muted mt-1">No Negative Marking</div>
              </div>
            </div>
          </div>

          {/* Bilingual Test Feature */}
          <div className="card p-6 sm:p-8 rounded-2xl bg-surface">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Languages className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
                CCC Online Test in Hindi and English
              </h2>
            </div>
            <p className="text-text-secondary text-sm sm:text-base leading-relaxed mb-4">
              Real NIELIT examinations allow candidates to view questions in both English and Hindi. CCC Guru replicates this bilingual experience seamlessly. You can toggle between <strong>Hindi</strong> and <strong>English</strong> at any question without losing your entered answers or timer progress.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-text-secondary">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Dual language support for questions, options &amp; explanations</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Technical computer terminology clarified in both mediums</span>
              </div>
            </div>
          </div>

          {/* Full Mock Tests vs Chapter-Wise Tests */}
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-4">
              Full Mock Tests vs. CCC Chapter Wise Test
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="card p-5 rounded-xl border border-border">
                <h3 className="font-bold text-text-primary text-base mb-2 flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-primary-600" />
                  CCC Full Mock Test
                </h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-3">
                  Comprehensive 100-question mock tests covering all 9–10 modules of the official syllabus. Best for timed practice, exam stamina, and final revision before the actual exam day.
                </p>
                <Link
                  href="/test-series/ccc-full-mock-test-series-2026"
                  className="text-xs font-semibold text-primary-600 hover:underline inline-flex items-center gap-1"
                >
                  Attempt Full Mock Series →
                </Link>
              </div>

              <div className="card p-5 rounded-xl border border-border">
                <h3 className="font-bold text-text-primary text-base mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary-600" />
                  CCC Chapter Wise Test
                </h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-3">
                  Targeted practice tests focused on specific syllabus chapters such as LibreOffice Writer, LibreOffice Calc, LibreOffice Impress, Digital Financial Tools, and Cyber Security.
                </p>
                <Link
                  href="/test-series/ccc-chapter-wise-test-series-2026"
                  className="text-xs font-semibold text-primary-600 hover:underline inline-flex items-center gap-1"
                >
                  Attempt Chapter Wise Series →
                </Link>
              </div>
            </div>
          </div>

          {/* Official NIELIT Grading Scale */}
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-3">
              Official NIELIT CCC Grading Scale
            </h2>
            <p className="text-xs sm:text-sm text-text-muted mb-4">
              Every score in the CCC exam is categorized under the following official NIELIT grade benchmarks:
            </p>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border bg-surface-elevated text-xs font-semibold text-text-muted uppercase">
                    <th className="py-3 px-4">Grade</th>
                    <th className="py-3 px-4">Score Range</th>
                    <th className="py-3 px-4">Qualification Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle text-text-secondary text-xs sm:text-sm">
                  <tr>
                    <td className="py-3 px-4 font-bold text-text-primary">Grade S</td>
                    <td className="py-3 px-4 font-medium">85% and above</td>
                    <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-semibold">Outstanding</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-text-primary">Grade A</td>
                    <td className="py-3 px-4 font-medium">75% to 84%</td>
                    <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-semibold">Excellent</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-text-primary">Grade B</td>
                    <td className="py-3 px-4 font-medium">65% to 74%</td>
                    <td className="py-3 px-4 text-blue-600 dark:text-blue-400 font-semibold">Good</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-text-primary">Grade C</td>
                    <td className="py-3 px-4 font-medium">55% to 64%</td>
                    <td className="py-3 px-4 text-purple-600 dark:text-purple-400 font-semibold">Satisfactory</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-text-primary">Grade D</td>
                    <td className="py-3 px-4 font-medium">50% to 54%</td>
                    <td className="py-3 px-4 text-amber-600 dark:text-amber-400 font-semibold">Pass (Minimum Qualifying)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-text-primary">Grade F</td>
                    <td className="py-3 px-4 font-medium">Below 50%</td>
                    <td className="py-3 px-4 text-rose-600 dark:text-rose-400 font-semibold">Fail (Re-appearance Required)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* How to Use the Online Tests */}
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-4">
              How to Prepare with CCC Practice Tests
            </h2>
            <ol className="list-decimal list-inside space-y-2.5 text-sm sm:text-base text-text-secondary leading-relaxed">
              <li>
                <strong>Start with Chapter Tests:</strong> Complete tests module-by-module in the{' '}
                <Link href="/chapters" className="text-primary-600 hover:underline">
                  Chapters section
                </Link>{' '}
                to strengthen your computer basics and LibreOffice skills.
              </li>
              <li>
                <strong>Simulate Exam Conditions:</strong> Attempt 100-question full mock tests without breaks in a quiet environment.
              </li>
              <li>
                <strong>Review Answers &amp; Explanations:</strong> Analyze incorrect and skipped questions to identify weak areas.
              </li>
              <li>
                <strong>Verify Syllabus Coverage:</strong> Check topic checklists against the official{' '}
                <Link href="/ccc-syllabus" className="text-primary-600 hover:underline">
                  NIELIT CCC Syllabus 2026
                </Link>
                .
              </li>
            </ol>
          </div>

          {/* Frequently Asked Questions */}
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary-600" />
              Frequently Asked Questions (CCC Online Test 2026)
            </h2>
            <div className="space-y-3">
              {TEST_FAQS.map(({ q, a }, index) => (
                <details key={index} className="card group" name="test-faq">
                  <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                    <h3 className="font-semibold text-text-primary text-sm sm:text-base pr-4">
                      {q}
                    </h3>
                    <ChevronDown className="w-4 h-4 text-text-muted shrink-0 group-open:rotate-180 transition-transform duration-200" />
                  </summary>
                  <div className="px-5 pb-5 border-t border-border-subtle pt-3">
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {a}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Related CCC Resources */}
          <div className="card p-6 sm:p-8 rounded-2xl bg-bg-subtle border border-border">
            <h2 className="text-xl font-bold text-text-primary mb-4">
              Related CCC Study Resources
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                href="/ccc-syllabus"
                className="card p-4 hover:border-primary-400 transition-colors flex flex-col gap-1.5"
              >
                <div className="flex items-center gap-2 font-semibold text-sm text-text-primary">
                  <GraduationCap className="w-4 h-4 text-primary-600" />
                  <span>CCC Syllabus 2026</span>
                </div>
                <p className="text-xs text-text-muted">
                  Official 10-chapter revised curriculum and download PDF
                </p>
              </Link>

              <Link
                href="/chapters"
                className="card p-4 hover:border-primary-400 transition-colors flex flex-col gap-1.5"
              >
                <div className="flex items-center gap-2 font-semibold text-sm text-text-primary">
                  <BookOpen className="w-4 h-4 text-primary-600" />
                  <span>Syllabus Chapters</span>
                </div>
                <p className="text-xs text-text-muted">
                  Study chapter-wise topics in Hindi and English
                </p>
              </Link>

              <Link
                href="/blogs"
                className="card p-4 hover:border-primary-400 transition-colors flex flex-col gap-1.5"
              >
                <div className="flex items-center gap-2 font-semibold text-sm text-text-primary">
                  <Laptop className="w-4 h-4 text-primary-600" />
                  <span>Exam Preparation Blogs</span>
                </div>
                <p className="text-xs text-text-muted">
                  Tips, shortcut keys, and exam day instructions
                </p>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
