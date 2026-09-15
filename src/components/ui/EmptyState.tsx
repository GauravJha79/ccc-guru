import { FileSearch, BookOpen, FlaskConical, FileText } from 'lucide-react';

interface EmptyStateProps {
  icon?: 'search' | 'book' | 'test' | 'note';
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const icons = {
  search: FileSearch,
  book: BookOpen,
  test: FlaskConical,
  note: FileText,
};

export function EmptyState({
  icon = 'search',
  title,
  description,
  action,
}: EmptyStateProps) {
  const Icon = icons[icon];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-950 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-primary-400" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-text-muted max-w-xs mb-6">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
