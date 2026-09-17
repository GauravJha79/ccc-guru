import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { FileText, Download, ExternalLink, BookOpen, ArrowRight } from 'lucide-react';
import { getNoteById, getNotes, getAllNoteIds } from '@/lib/data/notes';
import { Badge } from '@/components/ui/Badge';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { formatFileSize } from '@/lib/utils';

export const revalidate = 3600;

interface NotePageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const ids = await getAllNoteIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({ params }: NotePageProps): Promise<Metadata> {
  const { id } = await params;
  const note = await getNoteById(id);
  if (!note) return { title: 'Note Not Found' };

  return {
    title: note.title,
    description:
      note.description ??
      `Download ${note.title} — Free CCC study notes PDF with ${note.page_count} pages.`,
    alternates: { canonical: `/notes/${id}` },
    openGraph: {
      title: note.title,
      description: note.description ?? `Free CCC study notes PDF, ${note.page_count} pages.`,
      url: `/notes/${id}`,
      ...(note.thumbnail_url ? { images: [{ url: note.thumbnail_url }] } : {}),
    },
  };
}

export default async function NotePage({ params }: NotePageProps) {
  const { id } = await params;
  const note = await getNoteById(id);

  if (!note) notFound();

  // Related notes from same category
  const related = note.category_id
    ? await getNotes({ categoryId: note.category_id, limit: 4 })
    : [];
  const relatedNotes = related.filter((n) => n.id !== id).slice(0, 3);

  const noteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DigitalDocument',
    name: note.title,
    description: note.description ?? `Free CCC study notes PDF for NIELIT CCC exam.`,
    encodingFormat: 'application/pdf',
    inLanguage: ['en', 'hi'],
    isAccessibleForFree: true,
    publisher: {
      '@type': 'Organization',
      name: 'CCC Guru',
      url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cccguru.in',
    },
    url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cccguru.in'}/notes/${id}`,
  };

  return (
    <div className="container-page py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(noteJsonLd) }}
      />
      <Breadcrumbs
        items={[
          { label: 'Notes', href: '/notes' },
          ...(note.note_categories
            ? [{ label: note.note_categories.title, href: `/notes?category=${note.category_id}` }]
            : []),
          { label: note.title },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2">
          <div className="card p-6 mb-5">
            {note.note_categories && (
              <Badge variant="primary" className="mb-3">{note.note_categories.title}</Badge>
            )}

            <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
              {note.title}
            </h1>

            {note.hindi_title && note.hindi_title !== note.title && (
              <p className="text-lg text-text-secondary mb-4" lang="hi">
                {note.hindi_title}
              </p>
            )}

            {note.description && (
              <p className="text-text-secondary leading-relaxed mb-4">{note.description}</p>
            )}

            {note.hindi_description && note.hindi_description !== note.description && (
              <p className="text-text-secondary leading-relaxed mb-4" lang="hi">
                {note.hindi_description}
              </p>
            )}

            {/* Meta */}
            <div className="flex flex-wrap gap-4 text-sm text-text-muted border-t border-border pt-4">
              <span>{note.page_count} pages</span>
              <span>·</span>
              <span>{formatFileSize(note.file_size)}</span>
              <span>·</span>
              <span>PDF format</span>
            </div>
          </div>

          {/* Download / View button */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <a
              href={note.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex-1 justify-center py-3 text-base"
              id="download-note-btn"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </a>
            <a
              href={note.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary flex-1 justify-center py-3"
            >
              <ExternalLink className="w-4 h-4" />
              Preview Online
            </a>
          </div>

          {/* PDF Preview iframe (if browser supports) */}
          <div className="card overflow-hidden rounded-xl">
            <div className="bg-bg-subtle px-4 py-3 border-b border-border flex items-center justify-between">
              <span className="text-sm font-medium text-text-secondary">PDF Preview</span>
              <a
                href={note.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost text-xs"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Open in new tab
              </a>
            </div>
            <iframe
              src={`${note.pdf_url}#toolbar=0`}
              className="w-full h-[500px]"
              title={`${note.title} PDF preview`}
              loading="lazy"
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Thumbnail */}
          {note.thumbnail_url && (
            <div className="card overflow-hidden rounded-xl">
              <Image
                src={note.thumbnail_url}
                alt={note.title}
                width={400}
                height={250}
                className="object-cover w-full"
              />
            </div>
          )}

          {/* Quick info */}
          <div className="card p-5 space-y-3">
            <h2 className="font-semibold text-text-primary">Note Details</h2>
            {[
              { label: 'Pages', value: `${note.page_count}` },
              { label: 'File Size', value: formatFileSize(note.file_size) },
              { label: 'Format', value: 'PDF' },
              { label: 'Language', value: 'Hindi & English' },
              ...(note.note_categories ? [{ label: 'Category', value: note.note_categories.title }] : []),
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-text-muted">{label}</span>
                <span className="font-medium text-text-primary">{value}</span>
              </div>
            ))}
          </div>

          {/* Related notes */}
          {relatedNotes.length > 0 && (
            <div className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-text-primary">Related Notes</h2>
                <Link href="/notes" className="text-xs text-primary-600 hover:underline">
                  View all
                </Link>
              </div>
              <div className="space-y-3">
                {relatedNotes.map((r) => (
                  <Link
                    key={r.id}
                    href={`/notes/${r.id}`}
                    className="flex items-center gap-3 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-950 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-primary-500" />
                    </div>
                    <span className="text-sm text-text-secondary group-hover:text-primary-600 transition-colors line-clamp-2">
                      {r.title}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
