'use client';

import Link from 'next/link';
import { X, Home, FlaskConical, FileText, BookOpen, Library, GraduationCap, Info, Mail, Shield, FileCheck, Smartphone } from 'lucide-react';
import { useEffect } from 'react';

const DRAWER_LINKS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/tests', label: 'Tests', icon: FlaskConical },
  { href: '/notes', label: 'Notes', icon: FileText },
  { href: '/blogs', label: 'Blogs', icon: BookOpen },
  { href: '/books', label: 'Books', icon: Library },
  { href: '/ccc-syllabus', label: 'CCC Syllabus', icon: GraduationCap },
];

const SECONDARY_LINKS = [
  { href: '/about', label: 'About', icon: Info },
  { href: '/contact', label: 'Contact', icon: Mail },
  { href: '/privacy', label: 'Privacy Policy', icon: Shield },
  { href: '/terms', label: 'Terms of Service', icon: FileCheck },
];

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  pathname: string;
}

export function MobileDrawer({ open, onClose, pathname }: MobileDrawerProps) {
  // Lock body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside
        className={`
          fixed top-0 right-0 bottom-0 z-50 w-[280px] bg-surface
          border-l border-border shadow-modal
          flex flex-col transition-transform duration-300 ease-out
          ${open ? 'translate-x-0' : 'translate-x-full'}
        `}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <span className="font-bold text-lg text-text-primary">
            CCC <span className="gradient-text">Guru</span>
          </span>
          <button
            onClick={onClose}
            className="btn-ghost p-1.5"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3" aria-label="Mobile navigation">
          <div className="space-y-1">
            {DRAWER_LINKS.map(({ href, label, icon: Icon }) => {
              const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                    transition-all duration-150
                    ${isActive
                      ? 'bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300'
                      : 'text-text-secondary hover:bg-border-subtle hover:text-text-primary'
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-primary-600 dark:text-primary-400' : ''}`} />
                  {label}
                </Link>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <p className="px-3 mb-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
              More
            </p>
            <div className="space-y-1">
              {SECONDARY_LINKS.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-text-secondary hover:bg-border-subtle hover:text-text-primary transition-all duration-150"
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Download CTA */}
        <div className="p-4 border-t border-border">
          <Link
            href="/download"
            className="btn-primary w-full justify-center"
          >
            <Smartphone className="w-4 h-4" />
            Download App
          </Link>
          <p className="text-center text-xs text-text-muted mt-2">
            Android & iOS • Free
          </p>
        </div>
      </aside>
    </>
  );
}
