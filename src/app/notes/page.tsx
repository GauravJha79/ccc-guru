import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { FileText, Download, BookOpen } from 'lucide-react';
import { getNoteCategories, getNotes } from '@/lib/data/notes';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { CategoryFilter } from '@/components/ui/CategoryFilter';
import { formatFileSize } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'CCC Study Notes — Free PDF Notes for NIELIT CCC',
  description:
    'Download free CCC study notes in PDF. Chapter-wise, topic-wise bilingual notes for NIELIT CCC exam preparation. Easy to download and print.',
  alternates: { canonical: '/notes' },
  openGraph: {
    title: 'CCC Study Notes — Free PDF Notes',
    description: 'Free downloadable PDF notes for NIELIT CCC exam.',
    url: '/notes',
  },
};

interface NotesPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const { category } = await searchParams;

  const [categories, notes] = await Promise.all([
    getNoteCategories(),
    getNotes({ categoryId: category }),
  ]);

  const featured = notes.filter((n) => n.is_featured);
  const regular = notes.filter((n) => !n.is_featured);

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: 'Notes' }]} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">CCC Study Notes</h1>
        <p className="text-text-muted">
          Free downloadable PDF notes for NIELIT CCC exam — available in Hindi & English
        </p>
      </div>

      {/* Category filter */}
      {categories.length > 0 && (
        <div className="mb-6">
          <CategoryFilter
            options={categories.map((c) => ({ id: c.id, label: c.title }))}
            paramName="category"
            allLabel="All Notes"
          />
        </div>
      )}

      {notes.length === 0 ? (
        <EmptyState
          icon="note"
          title="No notes found"
          description="Study notes will be available here soon."
        />
      ) : (
        <>
          {/* Featured notes */}
          {featured.length > 0 && !category && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">⭐ Featured Notes</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {featured.map((note) => (
                  <NoteCard key={note.id} note={note} featured />
                ))}
              </div>
            </div>
          )}

          {/* All / regular notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {(category ? notes : regular).map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function NoteCard({
  note,
  featured = false,
}: {
  note: Awaited<ReturnType<typeof getNotes>>[0];
  featured?: boolean;
}) {
  return (
    <Link
      href={`/notes/${note.id}`}
      className={`card group flex ${featured ? 'flex-row gap-4 p-4' : 'flex-col gap-3 p-4'}`}
    >
      {/* Thumbnail */}
      <div
        className={`rounded-lg bg-primary-50 dark:bg-primary-950 flex items-center justify-center overflow-hidden shrink-0 ${
          featured ? 'w-20 h-24' : 'aspect-video w-full'
        }`}
      >
        {note.thumbnail_url ? (
          <Image
            src={note.thumbnail_url}
            alt={note.title}
            width={featured ? 80 : 200}
            height={featured ? 96 : 112}
            className="object-cover w-full h-full"
          />
        ) : (
          <FileText className="w-8 h-8 text-primary-300" />
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 gap-1.5">
        {note.note_categories && (
          <Badge variant="primary" size="sm">{note.note_categories.title}</Badge>
        )}
        <h3 className="text-sm font-semibold text-text-primary group-hover:text-primary-600 transition-colors line-clamp-2 leading-snug">
          {note.title}
        </h3>
        {note.hindi_title && note.hindi_title !== note.title && (
          <p className="text-xs text-text-muted line-clamp-1" lang="hi">{note.hindi_title}</p>
        )}
        <div className="flex items-center gap-2 mt-auto text-xs text-text-muted">
          <span>{note.page_count} pages</span>
          <span>·</span>
          <span>{formatFileSize(note.file_size)}</span>
        </div>
      </div>
    </Link>
  );
}
