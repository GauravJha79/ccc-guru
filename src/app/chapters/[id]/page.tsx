import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  FlaskConical,
  FileText,
  CheckCircle2,
  Clock,
  GraduationCap,
  ExternalLink,
  Laptop,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import {
  getChapterByIdOrSlug,
  getChapters,
  getAllChapterIds,
  getAllChapterSlugs,
  getChapterSlug,
} from '@/lib/data/chapters';
import { getChapterTestInfo } from '@/lib/data/tests';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { REVISED_SYLLABUS_DATA } from '@/lib/data/syllabus';
import { siteUrl } from '@/lib/utils';

export const revalidate = 3600;

interface ChapterPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const [ids, slugs] = await Promise.all([
    getAllChapterIds(),
    getAllChapterSlugs(),
  ]);
  const allParams = [
    ...ids.map((id) => ({ id })),
    ...slugs.map((slug) => ({ id: slug })),
  ];
  return allParams;
}

export async function generateMetadata({ params }: ChapterPageProps): Promise<Metadata> {
  const { id } = await params;
  const chapter = await getChapterByIdOrSlug(id);
  if (!chapter) return { title: 'Chapter Not Found' };

  const canonicalSlug = getChapterSlug(chapter);
  const title = `Chapter ${chapter.sort_order}: ${chapter.title} — NIELIT CCC Study Guide 2026`;
  const description =
    chapter.description ??
    `Study Chapter ${chapter.sort_order}: ${chapter.title} (${chapter.hindi_title}) for NIELIT CCC exam 2026. Important topics, bilingual terminology, and chapter-wise mock tests.`;

  return {
    title,
    description,
    alternates: { canonical: siteUrl(`/chapters/${canonicalSlug}`) },
    openGraph: {
      title,
      description,
      url: siteUrl(`/chapters/${canonicalSlug}`),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { id } = await params;
  const chapter = await getChapterByIdOrSlug(id);

  if (!chapter) notFound();

  const allChapters = await getChapters();
  const canonicalSlug = getChapterSlug(chapter);

  // Match syllabus chapter data by sort_order
  const syllabusData = REVISED_SYLLABUS_DATA.find(
    (s) => s.no === chapter.sort_order
  ) || REVISED_SYLLABUS_DATA[0];

  // Fetch chapter-wise test metadata
  const chapterTestInfo = getChapterTestInfo(chapter.sort_order);
  const chapterTestUrl = chapterTestInfo
    ? chapterTestInfo.testUrl
    : '/test-series/ccc-chapter-wise-test-series-2026';

  // Prev / Next chapters
  const currentIndex = allChapters.findIndex((c) => c.id === chapter.id);
  const prevChapter = currentIndex > 0 ? allChapters[currentIndex - 1] : null;
  const nextChapter =
    currentIndex >= 0 && currentIndex < allChapters.length - 1
      ? allChapters[currentIndex + 1]
      : null;

  const chapterJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: `Chapter ${chapter.sort_order}: ${chapter.title}`,
    description: chapter.description ?? `Study ${chapter.title} for NIELIT CCC exam 2026.`,
    learningResourceType: 'Chapter Study Guide',
    educationalLevel: 'NIELIT CCC Certification',
    inLanguage: ['en', 'hi'],
    isAccessibleForFree: true,
    publisher: {
      '@type': 'Organization',
      name: 'CCC Guru',
      url: 'https://www.cccguru.in',
    },
    url: siteUrl(`/chapters/${canonicalSlug}`),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl(),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'CCC Chapters',
        item: siteUrl('/chapters'),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `Chapter ${chapter.sort_order}: ${chapter.title}`,
        item: siteUrl(`/chapters/${canonicalSlug}`),
      },
    ],
  };

  return (
    <div className="container-page py-8 max-w-4xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(chapterJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Breadcrumbs
        items={[
          { label: 'Chapters', href: '/chapters' },
          { label: `Chapter ${chapter.sort_order}: ${chapter.title}` },
        ]}
      />

      {/* ── Chapter Hero Card ── */}
      <div className="card-elevated rounded-2xl p-6 sm:p-8 mb-8 border border-border shadow-card">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 border border-primary-200/60 dark:border-primary-800/60">
            <Sparkles className="w-3.5 h-3.5" />
            Chapter {chapter.sort_order} of 10 (Official CCC Syllabus)
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-surface-elevated border border-border text-text-muted">
            {syllabusData.theoryHours}h Theory + {syllabusData.practicalHours}h Practical
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-text-primary mb-2 leading-tight">
          Chapter {chapter.sort_order}: {chapter.title}
        </h1>

        {chapter.hindi_title && chapter.hindi_title !== chapter.title && (
          <p className="text-lg sm:text-xl font-semibold text-text-secondary mb-4" lang="hi">
            {chapter.hindi_title}
          </p>
        )}

        {chapter.description && (
          <p className="text-text-secondary leading-relaxed text-sm sm:text-base mb-6 max-w-3xl">
            {chapter.description}
          </p>
        )}

        {/* Quick CTA row */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border-subtle">
          {chapterTestInfo && (
            <Link
              href={chapterTestUrl}
              className="btn-primary text-sm px-5 py-2.5 flex items-center gap-2"
            >
              <FlaskConical className="w-4 h-4" />
              Practice Chapter {chapter.sort_order} Online Test (100 Qs)
            </Link>
          )}
          <Link
            href="/test-series/ccc-full-mock-test-series-2026"
            className="btn-secondary text-sm px-5 py-2.5 flex items-center gap-2"
          >
            <Laptop className="w-4 h-4" />
            Full Mock Tests
          </Link>
          <Link
            href="/ccc-syllabus"
            className="btn-ghost text-sm flex items-center gap-1.5"
          >
            <GraduationCap className="w-4 h-4" />
            Full Syllabus PDF
          </Link>
        </div>
      </div>

      {/* ── Key Topics Checklist (English + Hindi) ── */}
      <div className="card rounded-2xl p-6 sm:p-8 mb-8 border border-border">
        <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-2 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary-600" />
          Key Topics &amp; Learning Objectives
        </h2>
        <p className="text-xs sm:text-sm text-text-muted mb-6">
          Topics covered under Chapter {chapter.sort_order} as per the official NIELIT Revision 4 curriculum:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* English Topics */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted border-b border-border pb-2">
              Topics in English
            </h3>
            <ul className="space-y-2.5">
              {syllabusData.topicsEn.map((topic, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-text-secondary leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>{topic}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Hindi Topics */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted border-b border-border pb-2" lang="hi">
              मुख्य विषय (हिंदी में)
            </h3>
            <ul className="space-y-2.5" lang="hi">
              {syllabusData.topicsHi.map((topic, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-text-secondary leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" />
                  <span>{topic}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Practice Test & Question Bank CTA ── */}
      <div className="card p-6 sm:p-8 rounded-2xl bg-surface border border-border mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider block mb-1">
              Chapter-Wise Online Assessment
            </span>
            <h2 className="text-xl font-bold text-text-primary mb-1">
              Ready to test your knowledge on {chapter.title}?
            </h2>
            <p className="text-xs sm:text-sm text-text-muted">
              Attempt objective MCQs in Hindi &amp; English with immediate score evaluation and answers.
            </p>
          </div>
          {chapterTestInfo ? (
            <Link
              href={chapterTestUrl}
              className="btn-primary shrink-0 text-sm px-6 py-3"
            >
              Start Chapter {chapter.sort_order} Test
            </Link>
          ) : (
            <Link href="/tests" className="btn-primary shrink-0 text-sm px-6 py-3">
              Browse Online Tests
            </Link>
          )}
        </div>
      </div>

      {/* ── Official Source & Reference Information ── */}
      <div className="p-4 sm:p-5 rounded-xl bg-bg-subtle border border-border text-xs text-text-muted mb-8 leading-relaxed">
        <p>
          <strong>Official Syllabus Reference:</strong> This chapter guide is aligned with the Course on Computer Concepts (CCC) Revision 4 blueprint published by the <strong>National Institute of Electronics and Information Technology (NIELIT)</strong>, an autonomous scientific society under the Ministry of Electronics and Information Technology (MeitY), Government of India.
        </p>
      </div>

      {/* ── Previous & Next Navigation ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border">
        {prevChapter ? (
          <Link
            href={`/chapters/${getChapterSlug(prevChapter)}`}
            className="card p-4 flex items-center gap-3 group hover:border-primary-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-text-muted group-hover:text-primary-600 transition-colors shrink-0" />
            <div className="min-w-0">
              <span className="text-[11px] text-text-muted block">Previous Chapter</span>
              <span className="text-sm font-semibold text-text-primary group-hover:text-primary-600 truncate block">
                Chapter {prevChapter.sort_order}: {prevChapter.title}
              </span>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {nextChapter && (
          <Link
            href={`/chapters/${getChapterSlug(nextChapter)}`}
            className="card p-4 flex items-center justify-between gap-3 text-right group hover:border-primary-400 transition-colors sm:ml-auto w-full"
          >
            <div className="min-w-0 flex-1 text-right">
              <span className="text-[11px] text-text-muted block">Next Chapter</span>
              <span className="text-sm font-semibold text-text-primary group-hover:text-primary-600 truncate block">
                Chapter {nextChapter.sort_order}: {nextChapter.title}
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-primary-600 transition-colors shrink-0" />
          </Link>
        )}
      </div>

      <div className="mt-8 text-center">
        <Link href="/chapters" className="btn-ghost text-sm">
          ← View All Chapters
        </Link>
      </div>
    </div>
  );
}
