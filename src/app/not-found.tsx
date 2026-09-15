import Link from 'next/link';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center px-4">
        <div className="w-20 h-20 rounded-2xl bg-primary-50 dark:bg-primary-950 flex items-center justify-center mx-auto mb-6">
          <FileQuestion className="w-10 h-10 text-primary-400" />
        </div>
        <h1 className="text-6xl font-black gradient-text mb-3">404</h1>
        <h2 className="text-2xl font-bold text-text-primary mb-3">Page Not Found</h2>
        <p className="text-text-muted mb-8 max-w-sm">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-primary">
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <Link href="/tests" className="btn-secondary">
            Take a Mock Test
          </Link>
        </div>
      </div>
    </div>
  );
}
