"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";

interface FilterOption {
  id: string;
  label: string;
}

interface CategoryFilterProps {
  options: FilterOption[];
  paramName?: string;
  allLabel?: string;
}

export function CategoryFilter({
  options,
  paramName = "category",
  allLabel = "All",
}: CategoryFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const current = searchParams.get(paramName) ?? "";

  const handleSelect = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id) {
      params.set(paramName, id);
    } else {
      params.delete(paramName);
    }
    params.delete("page");
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const allOptions = [{ id: "", label: allLabel }, ...options];

  return (
    <div
      className="flex items-center gap-2 flex-wrap"
      role="group"
      aria-label="Filter by category"
    >
      {allOptions.map(({ id, label }) => {
        const isActive = current === id;
        return (
          <button
            key={id || "__all__"}
            onClick={() => handleSelect(id)}
            aria-pressed={isActive}
            disabled={isPending}
            className={`
              badge cursor-pointer transition-all duration-150 text-sm
              ${
                isActive
                  ? "bg-primary-600 text-white shadow-sm"
                  : "bg-surface border border-border text-text-secondary hover:border-primary-400 hover:text-primary-600"
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
