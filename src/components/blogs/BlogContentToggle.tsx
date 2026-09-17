'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface BlogContentToggleProps {
  contentEn: string;
  contentHi: string;
}

const BLOG_LANG_KEY = 'ccc-blog-language-preference';

export function BlogContentToggle({ contentEn, contentHi }: BlogContentToggleProps) {
  const [lang, setLang] = useState<'en' | 'hi'>('en');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(BLOG_LANG_KEY) as 'en' | 'hi' | null;
      if (saved && (saved === 'en' || saved === 'hi')) {
        setLang(saved);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const handleLangChange = (newLang: 'en' | 'hi') => {
    setLang(newLang);
    try {
      localStorage.setItem(BLOG_LANG_KEY, newLang);
    } catch {
      // Ignore storage errors
    }
  };

  const hasHindi = contentHi && contentHi.trim().length > 0 && contentHi !== contentEn;
  const currentContent = (lang === 'en' ? contentEn : contentHi) || contentEn;

  return (
    <div>
      {hasHindi && (
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => handleLangChange('en')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              lang === 'en'
                ? 'bg-primary-600 text-white'
                : 'bg-surface border border-border text-text-secondary hover:border-primary-400'
            }`}
          >
            English
          </button>
          <button
            onClick={() => handleLangChange('hi')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              lang === 'hi'
                ? 'bg-primary-600 text-white'
                : 'bg-surface border border-border text-text-secondary hover:border-primary-400'
            }`}
          >
            हिन्दी
          </button>
        </div>
      )}

      <div className="prose-ccc" lang={lang}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {currentContent}
        </ReactMarkdown>
      </div>
    </div>
  );
}
