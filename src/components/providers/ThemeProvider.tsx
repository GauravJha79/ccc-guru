'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ReactNode } from 'react';

// Suppress React 19 false-positive console warning for next-themes internal theme script
if (process.env.NODE_ENV === 'development') {
  const origError = console.error;
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Encountered a script tag')
    ) {
      return;
    }
    origError.apply(console, args);
  };
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="ccc-prep-theme"
    >
      {children}
    </NextThemesProvider>
  );
}
