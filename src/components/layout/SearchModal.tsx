'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

const QUICK_LINKS = [
  { label: 'All Tests', href: '/tests' },
  { label: 'CCC Notes', href: '/notes' },
  { label: 'Latest Blogs', href: '/blogs' },
  { label: 'Books', href: '/books' },
  { label: 'CCC Syllabus', href: '/ccc-syllabus' },
];

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (!open) {
          // Will be triggered from parent
        }
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const q = encodeURIComponent(query.trim());
    router.push(`/search?q=${q}`);
    onClose();
  };

  const handleQuickLink = (href: string) => {
    router.push(href);
    onClose();
  };

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="fixed top-[15%] left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4 animate-slide-in-up"
        role="dialog"
        aria-modal="true"
        aria-label="Search"
      >
        <div className="card-elevated rounded-xl shadow-modal overflow-hidden">
          <form onSubmit={handleSearch}>
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <Search className="w-5 h-5 text-text-muted shrink-0" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tests, notes, blogs, books..."
                className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted text-base outline-none"
                aria-label="Search query"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="text-text-muted hover:text-text-secondary"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>

          <div className="p-4">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
              Quick Links
            </p>
            <div className="space-y-1">
              {QUICK_LINKS.map(({ label, href }) => (
                <button
                  key={href}
                  onClick={() => handleQuickLink(href)}
                  className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm text-text-secondary hover:bg-border-subtle hover:text-text-primary transition-all duration-150 text-left"
                >
                  <span>{label}</span>
                  <ArrowRight className="w-4 h-4 opacity-40" />
                </button>
              ))}
            </div>
          </div>

          <div className="px-4 pb-3 flex justify-between items-center text-xs text-text-muted border-t border-border pt-3">
            <span>Press <kbd className="border border-border rounded px-1">Enter</kbd> to search</span>
            <span>Press <kbd className="border border-border rounded px-1">Esc</kbd> to close</span>
          </div>
        </div>
      </div>
    </>
  );
}
