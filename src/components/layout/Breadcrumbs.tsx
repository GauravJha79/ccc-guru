import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const allItems = [{ label: 'Home', href: '/' }, ...items];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: allItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href
        ? {
            item: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cccguru.in'}${item.href}`,
          }
        : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1 text-sm text-text-muted flex-wrap py-3"
      >
        {allItems.map((item, index) => (
          <span key={index} className="flex items-center gap-1">
            {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-text-muted/50 shrink-0" />}
            {item.href && index < allItems.length - 1 ? (
              <Link
                href={item.href}
                className="hover:text-primary-600 transition-colors"
              >
                {index === 0 ? (
                  <span className="flex items-center gap-1">
                    <Home className="w-3.5 h-3.5" />
                    <span className="sr-only">Home</span>
                  </span>
                ) : item.label}
              </Link>
            ) : (
              <span
                className={index === allItems.length - 1 ? 'text-text-secondary font-medium' : ''}
                aria-current={index === allItems.length - 1 ? 'page' : undefined}
              >
                {index === 0 ? (
                  <span className="flex items-center gap-1">
                    <Home className="w-3.5 h-3.5" />
                    <span className="sr-only">Home</span>
                  </span>
                ) : item.label}
              </span>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}
