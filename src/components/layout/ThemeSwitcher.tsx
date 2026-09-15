'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-1 p-1 rounded-lg bg-border-subtle">
        <div className="w-7 h-7 skeleton rounded-md" />
        <div className="w-7 h-7 skeleton rounded-md" />
        <div className="w-7 h-7 skeleton rounded-md" />
      </div>
    );
  }

  const options = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'system', icon: Monitor, label: 'System' },
    { value: 'dark', icon: Moon, label: 'Dark' },
  ] as const;

  return (
    <div
      className="flex items-center gap-0.5 p-1 rounded-lg"
      style={{ backgroundColor: 'rgb(var(--color-border-subtle))' }}
      role="radiogroup"
      aria-label="Theme"
    >
      {options.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          role="radio"
          aria-checked={theme === value}
          aria-label={`${label} theme`}
          title={`${label} theme`}
          className={`
            flex items-center justify-center w-7 h-7 rounded-md
            transition-all duration-200 cursor-pointer
            ${theme === value
              ? 'bg-surface text-primary-600 shadow-card'
              : 'text-text-muted hover:text-text-secondary'
            }
          `}
        >
          <Icon className="w-3.5 h-3.5" />
        </button>
      ))}
    </div>
  );
}
