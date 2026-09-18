import Link from "next/link";
import Image from "next/image";
import {
  FlaskConical,
  Users,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatPrice, getImageUrl } from "@/lib/utils";
import type { TestSeriesWithCategory, TestSeries } from "@/types/database";

interface TestSeriesCardProps {
  series: TestSeriesWithCategory | TestSeries;
  priority?: boolean;
}

export function TestSeriesCard({
  series,
  priority = false,
}: TestSeriesCardProps) {
  const description = series.featured_short_desc || series.description;
  const imageUrl = getImageUrl(series.featured_image);

  return (
    <Link
      href={`/test-series/${series.slug}`}
      className="group relative flex flex-col rounded-2xl bg-surface border border-border overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-primary-500/50 hover:shadow-card-hover dark:hover:border-primary-400/40"
    >
      {/* ── Visual Header / Thumbnail ── */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-gradient-to-br from-primary-900/10 via-primary-800/5 to-surface-elevated dark:from-primary-950/70 dark:via-surface-elevated dark:to-surface">
        {imageUrl ? (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-slate-900/5 dark:bg-black/50">
            {/* Ambient blurred backdrop so any aspect ratio fills seamlessly without blank edges */}
            <Image
              src={imageUrl}
              alt=""
              fill
              unoptimized
              aria-hidden
              className="object-cover w-full h-full blur-xl scale-125 opacity-20 dark:opacity-40 pointer-events-none"
            />
            {/* Crisp un-cut full image */}
            <Image
              src={imageUrl}
              alt={series.title}
              fill
              unoptimized
              priority={priority}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-contain w-full h-full relative z-0 group-hover:scale-[1.03] transition-transform duration-500 ease-out"
            />
          </div>
        ) : (
          /* Modern fallback illustration / banner when no image is uploaded */
          <div className="relative w-full h-full bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-900 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            <div className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full bg-primary-400/20 blur-2xl pointer-events-none" />

            {/* Geometric grid pattern overlay */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

            <div className="relative z-10 w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
              <FlaskConical className="w-7 h-7 text-white" />
            </div>

            <span className="relative z-10 mt-3 text-xs font-semibold tracking-wider uppercase text-primary-100/90">
              NIELIT CCC Mock Series
            </span>
          </div>
        )}

        {/* Floating Badges (Top) */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 z-10 pointer-events-none">
          <div className="flex flex-wrap gap-1.5">
            {series.is_featured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm">
                <Sparkles className="w-3 h-3 fill-current" />
                {series.featured_tag ?? "Featured"}
              </span>
            )}
          </div>

          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold shadow-sm ${
              series.is_paid
                ? "bg-amber-500 text-white"
                : "bg-emerald-500 text-white"
            }`}
          >
            {series.is_paid ? formatPrice(series.price) : "FREE"}
          </span>
        </div>

        {/* Floating Sets Indicator (Bottom overlay over image) */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-black/60 backdrop-blur-md text-white border border-white/10 shadow-sm">
            <FlaskConical className="w-3.5 h-3.5 text-primary-300" />
            {series.total_sets_available}{" "}
            {series.total_sets_available === 1 ? "Test Set" : "Test Sets"}
          </span>
        </div>
      </div>

      {/* ── Card Content ── */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div className="space-y-2">
          <h3 className="font-bold text-base md:text-lg text-text-primary group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 leading-snug">
            {series.title}
          </h3>

          {description && (
            <p className="text-xs md:text-sm text-text-secondary line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* ── Metadata & CTA Footer ── */}
        <div className="pt-3 border-t border-border-subtle flex items-center justify-between gap-2 mt-auto text-xs text-text-muted">
          <div className="flex items-center gap-3">
            {series.total_enrolled > 0 ? (
              <span className="flex items-center gap-1 font-medium">
                <Users className="w-3.5 h-3.5 text-primary-500" />
                {series.total_enrolled.toLocaleString()} Enrolled
              </span>
            ) : (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Hindi & English
              </span>
            )}
          </div>

          <div className="inline-flex items-center gap-1 font-semibold text-primary-600 dark:text-primary-400 group-hover:text-primary-700 dark:group-hover:text-primary-300 group-hover:translate-x-0.5 transition-all">
            <span>Start Practice</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
