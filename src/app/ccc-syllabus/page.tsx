import type { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  Download,
  CheckCircle2,
  Clock,
  BookOpen,
  Award,
  HelpCircle,
  ExternalLink,
  Laptop,
  Layers,
  Sparkles,
} from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SyllabusChaptersSection } from "@/components/syllabus/SyllabusChaptersSection";

export const metadata: Metadata = {
  title: "NIELIT CCC Revised Syllabus 2025-26 — Complete Chapter-wise Topics & PDF",
  description:
    "Download official NIELIT CCC revised syllabus (Revision 4). Explore complete 10 chapters covering LibreOffice Writer, Calc, Impress, Cyber Security, Future Skills, exam pattern, and grading system.",
  keywords: [
    "CCC syllabus",
    "NIELIT CCC syllabus",
    "CCC revised syllabus 2025",
    "CCC syllabus PDF download",
    "CCC exam pattern",
    "LibreOffice CCC syllabus",
    "CCC course duration",
    "NIELIT CCC chapters",
  ],
  alternates: { canonical: "/ccc-syllabus" },
  openGraph: {
    title: "NIELIT CCC Revised Syllabus 2025-26 — Complete Chapter-wise Topics & PDF",
    description:
      "Explore the latest 10-chapter NIELIT CCC revised syllabus with LibreOffice, Digital Financial Tools, Cyber Security, exam pattern, and PDF download.",
    url: "/ccc-syllabus",
  },
};

const OFFICIAL_SYLLABUS_PDF_URL =
  "https://www.nielit.in/sites/default/files/headquarter/pdf/20231006_CCC_Revised_Syllabus.pdf";

const syllabusJsonLd = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "NIELIT Course on Computer Concepts (CCC) Revised Syllabus",
  description:
    "Official 10-chapter revised syllabus for NIELIT CCC Examination covering Computer Fundamentals, LibreOffice (Writer, Calc, Impress), Internet, Digital Financial Tools, Cyber Security, and Future Skills.",
  provider: {
    "@type": "Organization",
    name: "NIELIT & CCC Guru",
    url: "https://cccguru.in",
  },
  url: "https://cccguru.in/ccc-syllabus",
  hasCourseInstance: {
    "@type": "CourseInstance",
    courseMode: "Bilingual (Hindi & English)",
    courseWorkload: "PT90H",
  },
};

interface GradeInfo {
  grade: string;
  percentage: string;
  remarks: string;
  badgeBg: string;
  pillBg: string;
  dotColor: string;
}

const GRADING_SYSTEM: GradeInfo[] = [
  {
    grade: "S",
    percentage: "85% and above",
    remarks: "Outstanding / Super",
    badgeBg: "bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 font-black shadow-md shadow-amber-500/25",
    pillBg: "bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300",
    dotColor: "bg-amber-500",
  },
  {
    grade: "A",
    percentage: "75% to 84%",
    remarks: "Excellent",
    badgeBg: "bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-black shadow-md shadow-emerald-500/25",
    pillBg: "bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300",
    dotColor: "bg-emerald-500",
  },
  {
    grade: "B",
    percentage: "65% to 74%",
    remarks: "Good",
    badgeBg: "bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-black shadow-md shadow-blue-500/25",
    pillBg: "bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300",
    dotColor: "bg-blue-500",
  },
  {
    grade: "C",
    percentage: "55% to 64%",
    remarks: "Satisfactory",
    badgeBg: "bg-gradient-to-br from-purple-500 to-violet-600 text-white font-black shadow-md shadow-purple-500/25",
    pillBg: "bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300",
    dotColor: "bg-purple-500",
  },
  {
    grade: "D",
    percentage: "50% to 54%",
    remarks: "Pass (Minimum Required)",
    badgeBg: "bg-gradient-to-br from-orange-500 to-amber-600 text-white font-black shadow-md shadow-orange-500/25",
    pillBg: "bg-orange-50 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800 text-orange-800 dark:text-orange-300",
    dotColor: "bg-orange-500",
  },
  {
    grade: "F",
    percentage: "Below 50%",
    remarks: "Fail (Re-appear in exam)",
    badgeBg: "bg-gradient-to-br from-rose-500 to-red-600 text-white font-black shadow-md shadow-rose-500/25",
    pillBg: "bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300",
    dotColor: "bg-rose-500",
  },
];

const FAQS = [
  {
    q: "Has the NIELIT CCC Syllabus changed from MS Office to LibreOffice?",
    a: "Yes. Under the revised syllabus (Revision 4), NIELIT exams exclusively feature LibreOffice (Writer, Calc, and Impress) alongside Ubuntu/Linux concepts rather than proprietary Microsoft Office tools.",
  },
  {
    q: "Is there any negative marking in the CCC Exam?",
    a: "No, there is no negative marking in the NIELIT CCC online exam. You get 1 mark for every correct answer, and 0 for incorrect or unattempted questions.",
  },
  {
    q: "What is the total duration and question count of the CCC Exam?",
    a: "The exam consists of 100 objective Multiple Choice (MCQ) & True/False questions to be solved in 90 minutes. The total course workload is 90 hours (30 hours theory + 60 hours practical).",
  },
  {
    q: "What is the minimum passing score required in CCC?",
    a: "Candidates must secure at least 50 marks out of 100 (50%) to achieve Grade D and earn the official NIELIT CCC Certificate.",
  },
];

export default function CCCSyllabusPage() {
  return (
    <div className="container-page py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(syllabusJsonLd) }}
      />

      <Breadcrumbs items={[{ label: "CCC Syllabus" }]} />

      <div className="max-w-4xl">
        {/* ── Hero Header ── */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
              <Sparkles className="w-3.5 h-3.5" />
              Latest NIELIT Revision 4 Syllabus
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 border border-primary-200/60 dark:border-primary-800/60">
              10 Chapters · 90 Hours
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary mb-4 leading-tight">
            NIELIT CCC Syllabus 2025-26
          </h1>

          <p className="text-text-secondary text-base sm:text-lg leading-relaxed mb-6">
            Official chapter-wise syllabus for the <strong>Course on Computer Concepts (CCC)</strong> conducted by 
            <strong> NIELIT (National Institute of Electronics & Information Technology)</strong>. Based on the updated 
            Revision 4 pattern with <strong>LibreOffice (Writer, Calc, Impress)</strong>, Digital Financial Services, Cyber Security, and Future Skills.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={OFFICIAL_SYLLABUS_PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex items-center gap-2 text-sm sm:text-base px-5 py-2.5 shadow-md shadow-primary-500/20"
            >
              <Download className="w-4 h-4" />
              Download Official Syllabus PDF
              <ExternalLink className="w-3.5 h-3.5 ml-0.5 opacity-80" />
            </a>
            <Link href="/tests" className="btn-secondary flex items-center gap-2 text-sm sm:text-base px-5 py-2.5">
              <Laptop className="w-4 h-4" />
              Practice CCC Mock Tests
            </Link>
          </div>
        </div>

        {/* ── Exam Pattern & Structure Card ── */}
        <div className="card-elevated rounded-2xl p-6 sm:p-8 mb-10 border border-border shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-text-primary flex items-center gap-2">
              <Award className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              Exam Pattern & Course Overview
            </h2>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-surface-elevated border border-border text-text-muted">
              Computer Based Online Test (CBT)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
            <div className="card p-3 sm:p-4 text-center bg-surface">
              <div className="text-xl sm:text-2xl font-black text-primary-600 dark:text-primary-400">100</div>
              <div className="text-[11px] sm:text-xs text-text-muted mt-1">Total Questions</div>
            </div>

            <div className="card p-3 sm:p-4 text-center bg-surface">
              <div className="text-xl sm:text-2xl font-black text-primary-600 dark:text-primary-400">90 Min</div>
              <div className="text-[11px] sm:text-xs text-text-muted mt-1">Exam Duration</div>
            </div>

            <div className="card p-3 sm:p-4 text-center bg-surface">
              <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">50%</div>
              <div className="text-[11px] sm:text-xs text-text-muted mt-1">Passing Marks</div>
            </div>

            <div className="card p-3 sm:p-4 text-center bg-surface">
              <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">0</div>
              <div className="text-[11px] sm:text-xs text-text-muted mt-1">Negative Marking</div>
            </div>

            <div className="card p-3 sm:p-4 text-center bg-surface">
              <div className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400">90 Hrs</div>
              <div className="text-[11px] sm:text-xs text-text-muted mt-1">30 Th + 60 Pr</div>
            </div>

            <div className="card p-3 sm:p-4 text-center bg-surface">
              <div className="text-xl sm:text-2xl font-black text-purple-600 dark:text-purple-400">EN / HI</div>
              <div className="text-[11px] sm:text-xs text-text-muted mt-1">Bilingual Exam</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-text-secondary border-t border-border-subtle pt-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span><strong>Question Types:</strong> Multiple Choice (MCQs) & True/False</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span><strong>Office Suite:</strong> LibreOffice 7.x (Writer, Calc, Impress)</span>
            </div>
          </div>
        </div>

        {/* ── Chapter-wise Detailed Syllabus (Bilingual with Hindi / English toggle) ── */}
        <SyllabusChaptersSection />

        {/* ── Grading System ── */}
        <div className="card-elevated rounded-2xl p-6 sm:p-8 mb-10 border border-border shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <h2 className="text-xl sm:text-2xl font-bold text-text-primary flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              NIELIT CCC Grading Scale
            </h2>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              Min. 50% to Pass (Grade D)
            </span>
          </div>

          <p className="text-xs sm:text-sm text-text-muted mb-6">
            Candidates who score 50% or above are awarded the official NIELIT CCC Certificate with the following grade classification:
          </p>

          {/* Visual Grade Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            {GRADING_SYSTEM.map((g) => (
              <div
                key={g.grade}
                className="card p-4 rounded-xl flex flex-col items-center text-center transition-all hover:-translate-y-1 hover:shadow-card-hover"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black mb-2 ${g.badgeBg}`}>
                  {g.grade}
                </div>
                <div className="text-xs font-bold text-text-primary mb-1">
                  {g.percentage}
                </div>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${g.pillBg}`}>
                  {g.remarks}
                </span>
              </div>
            ))}
          </div>

          {/* Detailed Table */}
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-border bg-surface-elevated text-xs font-semibold text-text-muted uppercase">
                  <th className="py-3 px-4">Grade</th>
                  <th className="py-3 px-4">Percentage Range</th>
                  <th className="py-3 px-4">Remarks & Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle text-text-secondary">
                {GRADING_SYSTEM.map((g) => (
                  <tr key={g.grade} className="hover:bg-surface-elevated/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-text-primary">
                      <div className="flex items-center gap-2.5">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm ${g.badgeBg}`}>
                          {g.grade}
                        </span>
                        <span className="font-bold text-sm">Grade {g.grade}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-text-primary">
                      <span className="inline-flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${g.dotColor}`} />
                        {g.percentage}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${g.pillBg}`}>
                        {g.remarks}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Frequently Asked Questions ── */}
        <div className="mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            Frequently Asked Questions on CCC Syllabus
          </h2>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="card p-5 rounded-xl border border-border">
                <h3 className="font-semibold text-text-primary mb-2 text-base">
                  {faq.q}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom CTA ── */}
        <div className="card-elevated rounded-2xl p-6 sm:p-8 text-center border border-border shadow-card">
          <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 flex items-center justify-center mx-auto mb-4">
            <Laptop className="w-6 h-6" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-text-primary mb-2">
            Ready to Prepare for the CCC Exam?
          </h3>
          <p className="text-text-secondary text-sm sm:text-base max-w-xl mx-auto mb-6">
            Take free bilingual mock tests based directly on this 10-chapter revised syllabus with instant answers, scores, and explanations.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/tests" className="btn-primary px-6 py-2.5">
              Start Free CCC Online Test
            </Link>
            <Link href="/notes" className="btn-secondary px-6 py-2.5">
              Download Chapter Notes
            </Link>
            <a
              href={OFFICIAL_SYLLABUS_PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary flex items-center gap-1.5 px-6 py-2.5"
            >
              <Download className="w-4 h-4" />
              Official PDF
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
