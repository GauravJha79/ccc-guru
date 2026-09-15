'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { useCallback, useTransition } from 'react';

interface SearchBarProps {
  placeholder?: string;
  paramName?: string;
}

export function SearchBar({ placeholder = 'Search...', paramName = 'q' }: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentValue = searchParams.get(paramName) ?? '';

  const handleChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(paramName, value);
      } else {
        params.delete(paramName);
      }
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [router, pathname, searchParams, paramName]
  );

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
      <input
        type="search"
        defaultValue={currentValue}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className="input-base pl-9 pr-9"
        aria-label={placeholder}
      />
      {isPending && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      )}
    </div>
  );
}
