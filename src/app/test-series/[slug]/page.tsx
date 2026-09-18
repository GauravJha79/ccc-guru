import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";
import {
  FlaskConical,
  Clock,
  BarChart3,
  Star,
  Users,
  ArrowRight,
  CheckCircle,
  CheckCircle2,
  Lock,
  ChevronRight,
  BookOpen,
  Sparkles,
  Play,
} from "lucide-react";
import { getTestSeriesBySlug, getTestSeriesItems } from "@/lib/data/tests";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { formatPrice, getDifficultyColor, getImageUrl } from "@/lib/utils";

export const dynamicParams = true;
export const revalidate = 60;

interface TestSeriesPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: TestSeriesPageProps): Promise<Metadata> {
  const { slug } = await params;
  const series = await getTestSeriesBySlug(slug);
  if (!series) return { title: "Test Series Not Found" };

  const title = `${series.title} — Free CCC Online Test`;
  const description =
    series.description ??
    `Practice ${series.title} CCC online test with ${series.total_sets_available} bilingual mock test sets. Free NIELIT CCC online exam practice with instant solutions.`;

  return {
    title,
    description,
    keywords: [
      series.title,
      "CCC online test",
      "CCC mock test",
      "NIELIT CCC online test",
      "CCC online practice test",
      "CCC exam test series",
    ],
    alternates: { canonical: `/test-series/${series.slug}` },
    openGraph: {
      title,
      description,
      url: `/test-series/${series.slug}`,
      images: series.featured_image
        ? [{ url: getImageUrl(series.featured_image) || series.featured_image }]
        : undefined,
    },
  };
}

export default async function TestSeriesPage({ params }: TestSeriesPageProps) {
  const { slug } = await params;
  const series = await getTestSeriesBySlug(slug);

  if (!series) notFound();

  const items = await getTestSeriesItems(series.id);
  const imageUrl = getImageUrl(series.featured_image);

  const testSeriesJsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: series.title,
    description:
      series.description ?? `Practice ${series.title} for NIELIT CCC exam.`,
    image: imageUrl,
    learningResourceType: "Practice Test / Quiz",
    educationalLevel: "NIELIT CCC Certification",
    inLanguage: ["en", "hi"],
    isAccessibleForFree: !series.is_paid,
    provider: {
      "@type": "Organization",
      name: "CCC Guru",
      url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://cccguru.in",
    },
    url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://cccguru.in"}/test-series/${series.slug}`,
  };

  return (
    <div className="container-page py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(testSeriesJsonLd) }}
      />
      <Breadcrumbs
        items={[{ label: "Tests", href: "/tests" }, { label: series.title }]}
      />

      {/* ── Modern Series Hero Header ── */}
      <div className="relative rounded-2xl md:rounded-3xl bg-surface border border-border overflow-hidden shadow-card p-6 md:p-8 lg:p-10 mb-10 transition-all">
        {/* Subtle decorative background glow */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-primary-500/5 dark:bg-primary-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-stretch lg:items-center gap-8">
          {/* Left Column: Details */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {series.test_categories && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 border border-primary-200/50 dark:border-primary-800/50">
                  {series.test_categories.title}
                </span>
              )}
              {series.is_featured && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm">
                  <Sparkles className="w-3 h-3 fill-current" />
                  {series.featured_tag ?? "Featured"}
                </span>
              )}
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                  series.is_paid
                    ? "bg-amber-500 text-white"
                    : "bg-emerald-500 text-white"
                }`}
              >
                {series.is_paid ? formatPrice(series.price) : "FREE"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-text-primary mb-4 leading-tight">
              {series.title}
            </h1>

            {series.description && (
              <p className="text-text-secondary leading-relaxed text-sm md:text-base mb-6 max-w-2xl">
                {series.description}
              </p>
            )}

            {/* Quick Feature Highlights */}
            <div className="flex flex-wrap gap-4 sm:gap-6 text-xs sm:text-sm text-text-secondary mb-8 pt-4 border-t border-border-subtle">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-950 flex items-center justify-center text-primary-600 dark:text-primary-400">
                  <FlaskConical className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-text-primary block">
                    {series.total_sets_available}
                  </span>
                  <span className="text-[11px] text-text-muted">Test Sets</span>
                </div>
              </div>

              {series.total_enrolled > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-text-primary block">
                      {series.total_enrolled.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-text-muted">
                      Enrolled
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-text-primary block">
                    Hindi & English
                  </span>
                  <span className="text-[11px] text-text-muted">
                    Bilingual Mode
                  </span>
                </div>
              </div>
            </div>

            {/* CTA action */}
            {items.length > 0 && (
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href={`/test-series/${series.slug}/${items[0].id}`}
                  className="btn-primary text-sm sm:text-base px-6 py-3 shadow-lg shadow-primary-500/25 flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Start First Test
                </Link>
                <span className="text-xs text-text-muted">
                  Instant Result & Solutions Included
                </span>
              </div>
            )}
          </div>

          {/* Right Column: Featured Image / Visual Card */}
          {imageUrl ? (
            <div className="w-full lg:w-96 shrink-0 aspect-[16/10] sm:aspect-video lg:aspect-[4/3] relative rounded-2xl overflow-hidden border border-border shadow-md">
              <Image
                src={imageUrl}
                alt={series.title}
                fill
                unoptimized
                priority
                sizes="(max-width: 1024px) 100vw, 384px"
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold z-10">
                <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10">
                  {series.total_sets_available} Mock Tests
                </span>
                <span className="px-2.5 py-1 rounded-md bg-primary-600/90 backdrop-blur-md">
                  NIELIT CCC Pattern
                </span>
              </div>
            </div>
          ) : (
            <div className="w-full lg:w-80 shrink-0 aspect-[16/10] sm:aspect-video lg:aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-900 border border-primary-500/30 shadow-lg flex flex-col items-center justify-center p-6 text-center text-white relative overflow-hidden">
              <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center mb-3">
                <FlaskConical className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-base text-white">{series.title}</h4>
              <p className="text-xs text-primary-200 mt-1">
                Full Mock Test Series
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Test Sets List ── */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
            Available Test Sets
          </h2>
          <p className="text-xs sm:text-sm text-text-muted mt-0.5">
            Select a test set below to begin your practice exam.
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 border border-primary-200/50 dark:border-primary-800/50">
          {items.length} {items.length === 1 ? "Set" : "Sets"}
        </span>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon="test"
          title="No tests published yet"
          description="Tests will be added to this series soon."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item, index) => (
            <Link
              key={item.id}
              href={`/test-series/${series.slug}/${item.id}`}
              className="group relative flex items-center gap-4 p-4 rounded-2xl bg-surface border border-border hover:border-primary-500/40 hover:shadow-card-hover transition-all duration-300"
            >
              {/* Number Badge */}
              <div className="w-11 h-11 rounded-xl bg-primary-50 dark:bg-primary-950 group-hover:bg-primary-600 dark:group-hover:bg-primary-600 flex items-center justify-center text-sm font-black text-primary-600 dark:text-primary-400 group-hover:text-white transition-all shrink-0">
                {index + 1}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-text-primary group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate">
                  {item.title}
                </h3>
                <div className="flex flex-wrap items-center gap-2.5 mt-1.5">
                  <span className="text-xs text-text-muted flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-primary-500" />{" "}
                    {item.duration}m
                  </span>
                  <span className="text-xs text-text-muted font-medium">
                    {item.question_count} Qs
                  </span>
                  <span className="text-xs text-text-muted font-medium">
                    {item.total_marks} Marks
                  </span>
                  <Badge
                    variant={
                      item.difficulty === "Easy"
                        ? "success"
                        : item.difficulty === "Hard"
                          ? "danger"
                          : "warning"
                    }
                    size="sm"
                  >
                    {item.difficulty}
                  </Badge>
                  {item.negative_marking_enabled && (
                    <span className="text-[11px] font-medium text-rose-500 bg-rose-50 dark:bg-rose-950/50 px-1.5 py-0.5 rounded">
                      −{item.negative_marks} Neg
                    </span>
                  )}
                </div>
              </div>

              {/* Arrow / Action */}
              <div className="w-8 h-8 rounded-full bg-surface-elevated group-hover:bg-primary-50 dark:group-hover:bg-primary-950 flex items-center justify-center text-text-muted group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors shrink-0">
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Detailed Description / Markdown Guide (SEO Content) */}
      {series.description_md && (
        <section className="mt-12 pt-8 border-t border-border">
          <div className="prose-ccc max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {series.description_md}
            </ReactMarkdown>
          </div>
        </section>
      )}
    </div>
  );
}
