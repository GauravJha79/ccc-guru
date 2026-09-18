import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, BookOpen, FlaskConical, FileText } from 'lucide-react';
import { getChapterById, getChapters, getAllChapterIds } from '@/lib/data/chapters';
import { getTestSeries } from '@/lib/data/tests';
import { getNotes } from '@/lib/data/notes';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

export const revalidate = 3600;

interface ChapterPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const ids = await getAllChapterIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({ params }: ChapterPageProps): Promise<Metadata> {
  const { id } = await params;
  const chapter = await getChapterById(id);
  if (!chapter) return { title: 'Chapter Not Found' };
  return {
    title: chapter.title,
    description:
      chapter.description ??
      `Study ${chapter.title} (${chapter.hindi_title}) for NIELIT CCC exam.`,
    alternates: { canonical: `/chapters/${id}` },
  };
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { id } = await params;
  const chapter = await getChapterById(id);

  if (!chapter) notFound();

  // Related content (best-effort)
  const [relatedTests, relatedNotes] = await Promise.all([
    getTestSeries({ limit: 3 }),
    getNotes({ limit: 3 }),
  ]);

  const chapterJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: chapter.title,
    description: chapter.description ?? `Study ${chapter.title} for NIELIT CCC exam.`,
    learningResourceType: 'Chapter Study Guide',
    educationalLevel: 'NIELIT CCC Certification',
    inLanguage: ['en', 'hi'],
    isAccessibleForFree: true,
    publisher: {
      '@type': 'Organization',
      name: 'CCC Guru',
      url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cccguru.in',
    },
    url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cccguru.in'}/chapters/${id}`,
  };

  return (
    <div className="container-page py-8 max-w-4xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(chapterJsonLd) }}
      />
      <Breadcrumbs
        items={[
          { label: 'Chapters', href: '/chapters' },
          { label: chapter.title },
        ]}
      />

      <div className="card p-6 md:p-8 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
          {chapter.title}
        </h1>
        {chapter.hindi_title && chapter.hindi_title !== chapter.title && (
          <p className="text-xl text-text-secondary mb-4" lang="hi">
            {chapter.hindi_title}
          </p>
        )}
        {chapter.description && (
          <p className="text-text-secondary leading-relaxed">{chapter.description}</p>
        )}
      </div>

      {/* Related content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {relatedTests.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-primary-500" />
              Practice Tests
            </h2>
            <div className="space-y-2">
              {relatedTests.map((s) => (
                <Link
                  key={s.id}
                  href={`/test-series/${s.slug}`}
                  className="card px-4 py-3 flex items-center gap-3 group"
                >
                  <FlaskConical className="w-4 h-4 text-primary-500 shrink-0" />
                  <span className="text-sm text-text-secondary group-hover:text-primary-600 transition-colors">
                    {s.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {relatedNotes.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary-500" />
              Study Notes
            </h2>
            <div className="space-y-2">
              {relatedNotes.map((n) => (
                <Link
                  key={n.id}
                  href={`/notes/${n.id}`}
                  className="card px-4 py-3 flex items-center gap-3 group"
                >
                  <FileText className="w-4 h-4 text-primary-500 shrink-0" />
                  <span className="text-sm text-text-secondary group-hover:text-primary-600 transition-colors">
                    {n.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6">
        <Link href="/chapters" className="btn-ghost text-sm">
          <ArrowLeft className="w-4 h-4" /> All Chapters
        </Link>
      </div>
    </div>
  );
}
