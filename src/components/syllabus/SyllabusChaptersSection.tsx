"use client";

import { useState } from "react";
import Link from "next/link";
import { Languages, BookOpen, Clock, ArrowRight, FlaskConical } from "lucide-react";
import { REVISED_SYLLABUS_DATA, type SyllabusChapterData } from "@/lib/data/syllabus";
import { getChapterTestInfo } from "@/lib/data/tests";
import { CHAPTER_SLUGS } from "@/lib/utils";

export type { SyllabusChapterData };
export { REVISED_SYLLABUS_DATA };

export function SyllabusChaptersSection() {
  const [lang, setLang] = useState<"en" | "hi">("en");

  const totalTheory = REVISED_SYLLABUS_DATA.reduce(
    (acc, c) => acc + c.theoryHours,
    0
  );
  const totalPractical = REVISED_SYLLABUS_DATA.reduce(
    (acc, c) => acc + c.practicalHours,
    0
  );

  return (
    <div className="mb-12">
      {/* ── Section Header with Language Switcher ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 p-4 rounded-2xl bg-surface border border-border">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-text-primary">
            {lang === "hi"
              ? "अध्याय-वार संशोधित पाठ्यक्रम (10 मॉड्यूल्स)"
              : "Chapter-wise Revised Syllabus (10 Modules)"}
          </h2>
          <p className="text-xs sm:text-sm text-text-muted mt-0.5">
            {lang === "hi"
              ? `कुल 10 अध्याय • ${totalTheory} घंटे थ्योरी • ${totalPractical} घंटे प्रैक्टिकल`
              : `Total 10 Chapters • ${totalTheory} Hrs Theory • ${totalPractical} Hrs Practical`}
          </p>
        </div>

        {/* Bilingual Toggle */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-background border border-border self-start sm:self-auto">
          <Languages className="w-3.5 h-3.5 text-text-muted ml-1.5" />
          <button
            type="button"
            onClick={() => setLang("en")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              lang === "en"
                ? "bg-primary text-white shadow-sm"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setLang("hi")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              lang === "hi"
                ? "bg-primary text-white shadow-sm"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            हिंदी
          </button>
        </div>
      </div>

      {/* ── Chapters List ── */}
      <div className="space-y-4">
        {REVISED_SYLLABUS_DATA.map((ch) => {
          const title = lang === "hi" ? ch.titleHi : ch.titleEn;
          const desc = lang === "hi" ? ch.descriptionHi : ch.descriptionEn;
          const topics = lang === "hi" ? ch.topicsHi : ch.topicsEn;

          return (
            <div
              key={ch.no}
              id={`chapter-${ch.no}`}
              className="group rounded-2xl border border-border bg-surface hover:border-primary/40 hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              <div className="p-5 sm:p-6">
                {/* Header row: Chapter badge + Title + Hours */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-xl bg-primary/10 text-primary font-bold text-sm">
                      {ch.no < 10 ? `0${ch.no}` : ch.no}
                    </span>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-text-primary group-hover:text-primary transition-colors">
                        {title}
                      </h3>
                      {lang === "en" && (
                        <p className="text-xs text-text-muted font-medium mt-0.5">
                          {ch.hindiSub}
                        </p>
                      )}
                      {lang === "hi" && (
                        <p className="text-xs text-text-muted font-medium mt-0.5">
                          {ch.titleEn}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Hours badge */}
                  <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto text-xs text-text-muted bg-background px-3 py-1.5 rounded-lg border border-border">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-primary" />
                      {ch.theoryHours}h {lang === "hi" ? "थ्योरी" : "Theory"}
                    </span>
                    <span className="text-border">•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-secondary" />
                      {ch.practicalHours}h {lang === "hi" ? "प्रैक्टिकल" : "Practical"}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-text-muted mb-4 leading-relaxed">
                  {desc}
                </p>

                {/* Topics Grid */}
                <div className="pt-3 border-t border-border/60">
                  <p className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-2.5">
                    {lang === "hi" ? "प्रमुख अध्ययन विषय:" : "Key Topics Covered:"}
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {topics.map((topic, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-xs text-text-secondary leading-normal"
                      >
                        <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-primary/70 mt-1.5" />
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Practice Link & Chapter Test Link */}
                <div className="mt-4 pt-3 border-t border-border/40 flex flex-wrap items-center justify-between gap-2.5">
                  <Link
                    href={`/chapters/${CHAPTER_SLUGS[ch.no] || `chapter-${ch.no}`}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-text-primary transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>
                      {lang === "hi"
                        ? `अध्याय ${ch.no} स्टडी गाइड`
                        : `Chapter ${ch.no} Study Guide`}
                    </span>
                  </Link>

                  {getChapterTestInfo(ch.no) && (
                    <Link
                      href={getChapterTestInfo(ch.no)!.testUrl}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-dark group-hover:translate-x-0.5 transition-all"
                    >
                      <FlaskConical className="w-3.5 h-3.5" />
                      <span>
                        {lang === "hi"
                          ? `अध्याय ${ch.no} का टेस्ट दें (100 प्रश्न)`
                          : `Take Chapter ${ch.no} Test (100 Qs)`}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
