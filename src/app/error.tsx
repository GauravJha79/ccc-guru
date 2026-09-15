'use client';

import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center px-4">
        <div className="w-20 h-20 rounded-2xl bg-red-50 dark:bg-red-950 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary mb-3">Something went wrong</h1>
        <p className="text-text-muted mb-8 max-w-sm">
          An unexpected error occurred. Please try again or go back to the home page.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button onClick={reset} className="btn-primary">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <Link href="/" className="btn-secondary">
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
