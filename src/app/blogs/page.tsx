import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Calendar, User, Tag, Clock, ArrowRight } from "lucide-react";
import { getBlogCategories, getBlogs } from "@/lib/data/blogs";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CategoryFilter } from "@/components/ui/CategoryFilter";
import { formatDate, readingTime } from "@/lib/utils";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "CCC Exam Blog — Tips, Guides & Latest Updates",
  description:
    "Expert articles, exam tips, study guides and latest CCC exam updates. Stay informed with CCC Guru blog.",
  alternates: { canonical: "/blogs" },
  openGraph: {
    title: "CCC Exam Blog — Tips, Guides & Updates",
    description: "Expert articles and latest CCC exam updates.",
    url: "/blogs",
  },
};

interface BlogsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function BlogsPage({ searchParams }: BlogsPageProps) {
  const { category } = await searchParams;

  const [categories, blogs] = await Promise.all([
    getBlogCategories(),
    getBlogs({ categoryId: category }),
  ]);

  const featured = blogs.find((b) => b.is_featured);
  const rest = blogs.filter((b) => !b.is_featured || category);

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: "Blogs" }]} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          CCC Exam Blog
        </h1>
        <p className="text-text-muted">
          Expert tips, study guides and latest CCC exam updates
        </p>
      </div>

      {/* Category filter */}
      {categories.length > 0 && (
        <div className="mb-6">
          <CategoryFilter
            options={categories.map((c) => ({ id: c.id, label: c.title }))}
            paramName="category"
            allLabel="All Articles"
          />
        </div>
      )}

      {blogs.length === 0 ? (
        <EmptyState
          icon="book"
          title="No articles found"
          description="Articles will be available here soon."
        />
      ) : (
        <>
          {/* Featured article */}
          {featured && !category && (
            <Link
              href={`/blogs/${featured.slug}`}
              className="card group overflow-hidden flex flex-col md:flex-row mb-8 gap-0"
            >
              {featured.featured_image && (
                <div className="md:w-2/5 aspect-video md:aspect-auto overflow-hidden bg-border-subtle">
                  <Image
                    src={featured.featured_image}
                    alt={featured.title_en}
                    width={600}
                    height={340}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="flex-1 p-6 flex flex-col justify-center gap-3">
                <div className="flex items-center gap-2">
                  <Badge variant="primary">Featured</Badge>
                  {featured.blog_categories && (
                    <Badge variant="outline">
                      {featured.blog_categories.title}
                    </Badge>
                  )}
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-text-primary group-hover:text-primary-600 transition-colors leading-snug">
                  {featured.title_en}
                </h2>
                {featured.summary_en && (
                  <p className="text-text-secondary line-clamp-3">
                    {featured.summary_en}
                  </p>
                )}
                <div className="flex items-center gap-3 text-sm text-text-muted mt-2">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    {featured.author}
                  </span>
                  {featured.published_at && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(featured.published_at)}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {readingTime(featured.content_en)}
                  </span>
                </div>
              </div>
            </Link>
          )}

          {/* Blog grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rest.map((blog) => (
              <Link
                key={blog.id}
                href={`/blogs/${blog.slug}`}
                className="card group flex flex-col overflow-hidden"
              >
                {blog.featured_image ? (
                  <div className="aspect-video overflow-hidden bg-border-subtle">
                    <Image
                      src={blog.featured_image}
                      alt={blog.title_en}
                      width={400}
                      height={225}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-primary-900 to-primary-700 flex items-center justify-center">
                    <span className="text-primary-300 text-4xl">📝</span>
                  </div>
                )}

                <div className="p-5 flex flex-col flex-1 gap-2">
                  {blog.blog_categories && (
                    <Badge variant="primary" size="sm">
                      {blog.blog_categories.title}
                    </Badge>
                  )}
                  <h2 className="font-semibold text-text-primary group-hover:text-primary-600 transition-colors line-clamp-2 leading-snug">
                    {blog.title_en}
                  </h2>
                  {blog.summary_en && (
                    <p className="text-sm text-text-muted line-clamp-2">
                      {blog.summary_en}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-auto pt-2 text-xs text-text-muted border-t border-border-subtle">
                    <span>{blog.author}</span>
                    {blog.published_at && (
                      <>
                        <span>·</span>
                        <span>{formatDate(blog.published_at)}</span>
                      </>
                    )}
                    <span className="ml-auto">
                      {readingTime(blog.content_en)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
