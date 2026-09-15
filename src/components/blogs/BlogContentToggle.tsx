'use client';

import { useState } from 'react';

interface BlogContentToggleProps {
  contentEn: string;
  contentHi: string;
}

export function BlogContentToggle({ contentEn, contentHi }: BlogContentToggleProps) {
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const hasHindi = contentHi && contentHi.trim().length > 0 && contentHi !== contentEn;

  return (
    <div>
      {hasHindi && (
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setLang('en')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              lang === 'en'
                ? 'bg-primary-600 text-white'
                : 'bg-surface border border-border text-text-secondary hover:border-primary-400'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLang('hi')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              lang === 'hi'
                ? 'bg-primary-600 text-white'
                : 'bg-surface border border-border text-text-secondary hover:border-primary-400'
            }`}
          >
            हिन्दी
          </button>
        </div>
      )}

      <div
        className="prose-ccc"
        lang={lang}
        dangerouslySetInnerHTML={{
          __html: lang === 'en' ? contentEn : contentHi,
        }}
      />
    </div>
  );
}
