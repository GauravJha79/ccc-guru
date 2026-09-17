import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Calendar, User, Clock, ArrowLeft, Tag } from 'lucide-react';
import { getBlogBySlug, getBlogs, getAllBlogSlugs } from '@/lib/data/blogs';
import { Badge } from '@/components/ui/Badge';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { formatDate, readingTime, siteUrl } from '@/lib/utils';

export const revalidate = 3600;

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) return { title: 'Blog Not Found' };

  return {
    title: blog.title_en,
    description: blog.summary_en ?? blog.title_en,
    alternates: { canonical: `/blogs/${slug}` },
    openGraph: {
      type: 'article',
      title: blog.title_en,
      description: blog.summary_en ?? '',
      url: `/blogs/${slug}`,
      publishedTime: blog.published_at ?? undefined,
      authors: [blog.author],
      ...(blog.featured_image ? { images: [{ url: blog.featured_image, width: 1200, height: 630 }] } : {}),
    },
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) notFound();

  // Related blogs
  const related = await getBlogs({
    categoryId: blog.category_id ?? undefined,
    excludeSlug: slug,
    limit: 3,
  });

  // Article JSON-LD
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: blog.title_en,
    description: blog.summary_en ?? '',
    author: { '@type': 'Person', name: blog.author },
    datePublished: blog.published_at,
    dateModified: blog.created_at,
    url: siteUrl(`/blogs/${slug}`),
    publisher: {
      '@type': 'Organization',
      name: 'CCC Guru',
      url: process.env.NEXT_PUBLIC_SITE_URL,
    },
    ...(blog.featured_image ? { image: blog.featured_image } : {}),
  };

  return (
    <div className="container-page py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <Breadcrumbs
        items={[
          { label: 'Blogs', href: '/blogs' },
          ...(blog.blog_categories
            ? [{ label: blog.blog_categories.title, href: `/blogs?category=${blog.category_id}` }]
            : []),
          { label: blog.title_en },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main article */}
        <article className="lg:col-span-3">
          {/* Featured image */}
          {blog.featured_image && (
            <div className="aspect-video overflow-hidden rounded-xl mb-6 bg-border-subtle">
              <Image
                src={blog.featured_image}
                alt={blog.title_en}
                width={900}
                height={506}
                className="object-cover w-full h-full"
                priority
              />
            </div>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {blog.blog_categories && (
              <Badge variant="primary">{blog.blog_categories.title}</Badge>
            )}
            {blog.is_featured && <Badge variant="warning">Featured</Badge>}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-3 leading-tight">
            {blog.title_en}
          </h1>

          {blog.title_hi && blog.title_hi !== blog.title_en && (
            <p className="text-xl text-text-secondary mb-4" lang="hi">
              {blog.title_hi}
            </p>
          )}

          {/* Author & date */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted pb-5 mb-6 border-b border-border">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" /> {blog.author}
            </span>
            {blog.published_at && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <time dateTime={blog.published_at}>{formatDate(blog.published_at)}</time>
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {readingTime(blog.content_en)}
            </span>
          </div>

          {/* Content tabs: EN / HI */}
          <BlogContent blog={blog} />
        </article>

        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-5">
          <Link href="/blogs" className="btn-ghost text-sm">
            <ArrowLeft className="w-4 h-4" /> All Blogs
          </Link>

          {/* Related posts */}
          {related.length > 0 && (
            <div className="card p-5">
              <h2 className="font-semibold text-text-primary mb-4">Related Articles</h2>
              <div className="space-y-4">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/blogs/${r.slug}`}
                    className="flex gap-3 group"
                  >
                    {r.featured_image && (
                      <div className="w-16 h-12 rounded-lg overflow-hidden bg-border-subtle shrink-0">
                        <Image
                          src={r.featured_image}
                          alt={r.title_en}
                          width={64}
                          height={48}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary group-hover:text-primary-600 transition-colors line-clamp-2 leading-snug">
                        {r.title_en}
                      </p>
                      {r.published_at && (
                        <p className="text-xs text-text-muted mt-1">{formatDate(r.published_at)}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="card p-5 text-center">
            <p className="text-sm font-semibold text-text-primary mb-2">
              Ready to practice?
            </p>
            <p className="text-xs text-text-muted mb-4">
              Take a free CCC mock test now
            </p>
            <Link href="/tests" className="btn-primary w-full justify-center text-sm">
              Start Mock Test
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

// Separate component for content language toggle
import { BlogContentToggle } from '@/components/blogs/BlogContentToggle';

function BlogContent({ blog }: { blog: Awaited<ReturnType<typeof getBlogBySlug>> }) {
  if (!blog) return null;
  return <BlogContentToggle contentEn={blog.content_en} contentHi={blog.content_hi} />;
}
