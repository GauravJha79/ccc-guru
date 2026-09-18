"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Link from "next/link";
import {
  Clock,
  Pause,
  Play,
  Info,
  Flag,
  Bookmark,
  AlertCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Home,
  Eye,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  LayoutGrid,
  Eraser,
  BookOpen,
  Send,
  Award,
  Trophy,
  TrendingUp,
  Sparkles,
  Check,
  Share2,
  Download,
  Copy,
  MessageCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";
import type {
  TestSeriesItem,
  Question,
  ExamAnswer,
  ExamResult,
  Chapter,
} from "@/types/database";
import { formatTimer } from "@/lib/utils";

interface ExamInterfaceProps {
  item: TestSeriesItem;
  questions: Question[];
  seriesSlug?: string;
  seriesId?: string;
  chapters?: Chapter[];
}

type ExamState = "active" | "paused" | "submitted";
type Language = "en" | "hi" | "both";

const STORAGE_KEY = "ccc-exam-language-preference";

export function ExamInterface({
  item,
  questions,
  seriesSlug,
  seriesId,
  chapters,
}: ExamInterfaceProps) {
  const [examState, setExamState] = useState<ExamState>("active");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<ExamAnswer[]>(
    questions.map((q) => ({
      questionId: q.id,
      selectedOption: null,
      isFlagged: false,
      timeSpent: 0,
    })),
  );
  const [timeLeft, setTimeLeft] = useState(item.duration * 60);
  const [language, setLanguage] = useState<Language>("en");
  const [result, setResult] = useState<ExamResult | null>(null);
  const [mobilePaletteOpen, setMobilePaletteOpen] = useState(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [showSubmitConfirmModal, setShowSubmitConfirmModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportIssueType, setReportIssueType] = useState(
    "Question / Option Error",
  );
  const [reportSuccess, setReportSuccess] = useState(false);

  const questionStartTime = useRef<number>(Date.now());
  const questionScrollRef = useRef<HTMLDivElement>(null);
  const paletteScrollRef = useRef<HTMLDivElement>(null);

  // Chapter mapping & filtering
  const chapterMap = useMemo(() => {
    const map = new Map<string, Chapter>();
    chapters?.forEach((c) => {
      map.set(c.id, c);
    });
    return map;
  }, [chapters]);

  const [selectedChapterId, setSelectedChapterId] = useState<string>("all");

  const chapterGroups = useMemo(() => {
    const groups: {
      id: string;
      title: string;
      hindiTitle?: string;
      questionIndices: number[];
      answeredCount: number;
      totalCount: number;
    }[] = [];
    const map = new Map<string, (typeof groups)[0]>();

    questions.forEach((q, idx) => {
      const cid = q.chapter_id || "general";
      if (!map.has(cid)) {
        let title = "General";
        let hindiTitle: string | undefined = undefined;

        if (q.chapter_id && chapterMap.has(q.chapter_id)) {
          const chap = chapterMap.get(q.chapter_id)!;
          title = chap.title;
          hindiTitle = chap.hindi_title;
        } else if (q.chapter_id) {
          title = `Chapter ${groups.length + 1}`;
        } else {
          title = item.title || "General";
        }

        const newGroup = {
          id: cid,
          title,
          hindiTitle,
          questionIndices: [idx],
          answeredCount: 0,
          totalCount: 0,
        };
        map.set(cid, newGroup);
        groups.push(newGroup);
      } else {
        map.get(cid)!.questionIndices.push(idx);
      }
    });

    // Populate counts
    groups.forEach((g) => {
      g.totalCount = g.questionIndices.length;
      g.answeredCount = g.questionIndices.filter(
        (i) => answers[i]?.selectedOption !== null,
      ).length;
    });

    return groups;
  }, [questions, chapterMap, item.title, answers]);

  // Questions visible under current chapter filter
  const visibleQuestionIndices = useMemo(() => {
    if (selectedChapterId === "all") {
      return questions.map((_, i) => i);
    }
    const group = chapterGroups.find((g) => g.id === selectedChapterId);
    return group ? group.questionIndices : questions.map((_, i) => i);
  }, [selectedChapterId, chapterGroups, questions]);

  const currentVisiblePos = visibleQuestionIndices.indexOf(currentIndex);

  // Load saved language preference
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (
        savedLang &&
        (savedLang === "en" || savedLang === "hi" || savedLang === "both")
      ) {
        setLanguage(savedLang);
      }
    } catch {
      // Ignore localStorage access errors
    }
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Ignore localStorage access errors
    }
  };

  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers[currentIndex] || {
    questionId: currentQuestion?.id || "",
    selectedOption: null,
    isFlagged: false,
    timeSpent: 0,
  };

  const currentQuestionChapterName = useMemo(() => {
    if (!currentQuestion?.chapter_id) return null;
    const chap = chapterMap.get(currentQuestion.chapter_id);
    if (!chap) return null;
    return language === "hi" && chap.hindi_title
      ? chap.hindi_title
      : chap.title;
  }, [currentQuestion, chapterMap, language]);

  const handleChapterTabClick = (chapterId: string) => {
    setSelectedChapterId(chapterId);
    if (chapterId === "all") return;
    const group = chapterGroups.find((g) => g.id === chapterId);
    if (group && group.questionIndices.length > 0) {
      if (!group.questionIndices.includes(currentIndex)) {
        navigate(group.questionIndices[0]);
      }
    }
  };

  // Timer countdown
  useEffect(() => {
    if (examState !== "active") return;
    if (timeLeft <= 0) {
      handleFinalSubmit();
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [examState, timeLeft]);

  // Track time per question
  useEffect(() => {
    questionStartTime.current = Date.now();
    // Scroll question content to top on question change
    if (questionScrollRef.current) {
      questionScrollRef.current.scrollTop = 0;
    }
  }, [currentIndex]);

  const updateCurrentTimeSpent = useCallback(() => {
    const elapsed = Math.floor((Date.now() - questionStartTime.current) / 1000);
    setAnswers((prev) =>
      prev.map((a, i) =>
        i === currentIndex ? { ...a, timeSpent: a.timeSpent + elapsed } : a,
      ),
    );
  }, [currentIndex]);

  const selectOption = (option: "A" | "B" | "C" | "D") => {
    setAnswers((prev) =>
      prev.map((a, i) =>
        i === currentIndex ? { ...a, selectedOption: option } : a,
      ),
    );
  };

  const clearCurrentResponse = () => {
    setAnswers((prev) =>
      prev.map((a, i) =>
        i === currentIndex ? { ...a, selectedOption: null } : a,
      ),
    );
  };

  const toggleFlag = () => {
    setAnswers((prev) =>
      prev.map((a, i) =>
        i === currentIndex ? { ...a, isFlagged: !a.isFlagged } : a,
      ),
    );
  };

  const navigate = (index: number) => {
    if (index < 0 || index >= questions.length) return;
    updateCurrentTimeSpent();
    questionStartTime.current = Date.now();
    setCurrentIndex(index);
    if (mobilePaletteOpen) {
      setMobilePaletteOpen(false);
    }
  };

  const handleNext = () => {
    if (
      currentVisiblePos >= 0 &&
      currentVisiblePos < visibleQuestionIndices.length - 1
    ) {
      navigate(visibleQuestionIndices[currentVisiblePos + 1]);
    } else if (
      selectedChapterId === "all" &&
      currentIndex < questions.length - 1
    ) {
      navigate(currentIndex + 1);
    } else {
      // Check if there is another chapter after current one
      const currentGroupIdx = chapterGroups.findIndex(
        (g) => g.id === selectedChapterId,
      );
      if (
        selectedChapterId !== "all" &&
        currentGroupIdx >= 0 &&
        currentGroupIdx < chapterGroups.length - 1
      ) {
        const nextGroup = chapterGroups[currentGroupIdx + 1];
        setSelectedChapterId(nextGroup.id);
        navigate(nextGroup.questionIndices[0]);
      } else {
        setShowSubmitConfirmModal(true);
      }
    }
  };

  const handlePrevious = () => {
    if (currentVisiblePos > 0) {
      navigate(visibleQuestionIndices[currentVisiblePos - 1]);
    } else if (selectedChapterId === "all" && currentIndex > 0) {
      navigate(currentIndex - 1);
    }
  };

  const handleFinalSubmit = useCallback(() => {
    updateCurrentTimeSpent();

    const finalAnswers = answers;
    let correct = 0;
    let wrong = 0;
    let skipped = 0;
    let score = 0;

    questions.forEach((q, i) => {
      const ans = finalAnswers[i];
      if (!ans || ans.selectedOption === null) {
        skipped++;
      } else if (ans.selectedOption === q.correct_option) {
        correct++;
        score += 1;
      } else {
        wrong++;
        if (item.negative_marking_enabled) {
          score -= item.negative_marks;
        }
      }
    });

    const timeTaken = Math.max(0, item.duration * 60 - timeLeft);

    const totalQuestions = questions.length;

    setResult({
      totalQuestions,
      attempted: correct + wrong,
      correct,
      wrong,
      skipped,
      score: Math.max(0, score),
      totalMarks: totalQuestions,
      accuracy:
        correct + wrong > 0
          ? Math.round((correct / (correct + wrong)) * 100)
          : 0,
      timeTaken,
      answers: finalAnswers,
    });

    setShowSubmitConfirmModal(false);
    setExamState("submitted");
  }, [answers, questions, item, timeLeft, updateCurrentTimeSpent]);

  // Statistics calculation for palette and badges
  const stats = useMemo(() => {
    let answered = 0;
    let marked = 0;
    let markedAndAnswered = 0;
    let notAnswered = 0;

    answers.forEach((ans) => {
      const hasAnswer = ans.selectedOption !== null;
      const isMarked = ans.isFlagged;

      if (isMarked && hasAnswer) {
        markedAndAnswered++;
      } else if (isMarked) {
        marked++;
      } else if (hasAnswer) {
        answered++;
      } else {
        notAnswered++;
      }
    });

    return {
      answered,
      marked,
      markedAndAnswered,
      notAnswered,
      totalAnswered: answered + markedAndAnswered,
    };
  }, [answers]);

  // Option text helper
  const getOption = (q: Question, key: "A" | "B" | "C" | "D") => {
    const map = {
      A: { en: q.option_a_en, hi: q.option_a_hi },
      B: { en: q.option_b_en, hi: q.option_b_hi },
      C: { en: q.option_c_en, hi: q.option_c_hi },
      D: { en: q.option_d_en, hi: q.option_d_hi },
    };
    return map[key];
  };

  // State styling for question palette cells
  const getPaletteCellClass = (i: number) => {
    const ans = answers[i];
    const isCurrent = i === currentIndex;
    const isAns = ans?.selectedOption !== null;
    const isFlg = ans?.isFlagged;

    if (isCurrent) {
      return "border-2 border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 font-black shadow-sm ring-2 ring-blue-100 dark:ring-blue-900/40";
    }
    if (isFlg && isAns) {
      return "bg-purple-600 text-white hover:bg-purple-700";
    }
    if (isFlg) {
      return "bg-rose-500 text-white hover:bg-rose-600";
    }
    if (isAns) {
      return "bg-emerald-500 text-white hover:bg-emerald-600";
    }
    return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700/60";
  };

  // ── Result Screen ──
  if (examState === "submitted" && result) {
    return (
      <ResultScreen
        result={result}
        questions={questions}
        item={item}
        seriesSlug={seriesSlug}
        seriesId={seriesId}
        chapters={chapters}
        initialLang={language}
        onReattempt={() => {
          setAnswers(
            questions.map((q) => ({
              questionId: q.id,
              selectedOption: null,
              isFlagged: false,
              timeSpent: 0,
            })),
          );
          setCurrentIndex(0);
          setTimeLeft(item.duration * 60);
          setExamState("active");
          setResult(null);
        }}
      />
    );
  }

  // Timer critical warning threshold (< 5 mins)
  const timerDanger = timeLeft < 5 * 60;

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-[#F5F7FA] dark:bg-[#090B14] select-none">
      {/* ── TOP HEADER (Dark Navy matching reference screenshot) ── */}
      <header className="shrink-0 bg-[#0A1628] dark:bg-[#060D18] text-white px-4 py-2.5 sm:px-6 sm:py-3 z-30 shadow-md">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand & Test Title */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Logo */}
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-white">
                <BookOpen className="w-5 h-5 text-blue-400" />
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-black tracking-wider text-white leading-tight uppercase">
                  CCC GURU
                </div>
                <div className="text-[10px] text-slate-400 font-medium tracking-tight">
                  Learn · Practice · Succeed
                </div>
              </div>
            </div>

            {/* Separator */}
            <div className="hidden md:block h-7 w-px bg-slate-700/60 shrink-0" />

            {/* Test Series Title & Chapter Subtitle */}
            <div className="min-w-0">
              <h1 className="text-xs sm:text-sm font-bold text-white truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                {item.title}
              </h1>
              <p className="text-[11px] text-slate-400 truncate">
                {item.test_type || "Chapter Wise Test Series"} ·{" "}
                {questions.length} Questions
              </p>
            </div>
          </div>

          {/* Right Controls: Timer + Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Countdown Timer */}
            <div
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg border font-mono ${
                timerDanger
                  ? "bg-red-500/20 border-red-500/40 text-red-400 animate-pulse"
                  : "bg-slate-800/80 border-slate-700/80 text-white"
              }`}
            >
              <Clock className="w-4 h-4 text-blue-400 shrink-0" />
              <div className="text-right">
                <div className="text-[9px] uppercase tracking-wider text-slate-400 hidden sm:block leading-none mb-0.5">
                  Time Left
                </div>
                <div className="text-xs sm:text-base font-bold tracking-wider leading-none">
                  {formatTimer(timeLeft)}
                </div>
              </div>
            </div>

            {/* Pause / Resume Button */}
            <button
              onClick={() => {
                if (examState === "active") {
                  setExamState("paused");
                } else {
                  setExamState("active");
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title={examState === "paused" ? "Resume Exam" : "Pause Exam"}
            >
              {examState === "paused" ? (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span className="hidden sm:inline">Resume</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span className="hidden sm:inline">Pause</span>
                </>
              )}
            </button>

            {/* Instructions Button */}
            <button
              onClick={() => setShowInstructionsModal(true)}
              className="text-slate-300 hover:text-white hover:bg-slate-800 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Info className="w-4 h-4 text-slate-400" />
              <span className="hidden md:inline">Instructions</span>
            </button>

            {/* End Test Button */}
            <button
              onClick={() => setShowSubmitConfirmModal(true)}
              className="text-slate-300 hover:text-white hover:bg-red-500/20 border border-slate-700 hover:border-red-500/40 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Flag className="w-3.5 h-3.5 text-slate-400" />
              <span>End Test</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── SUB-HEADER: Chapter / Topic Tabs ── */}
      <div className="shrink-0 bg-white dark:bg-[#101524] border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 shadow-2xs z-20">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none py-2 text-xs sm:text-sm">
          {/* If there are multiple chapters, show "All" tab */}
          {chapterGroups.length > 1 && (
            <button
              onClick={() => handleChapterTabClick("all")}
              className={`relative flex items-center gap-2 px-3 py-1.5 font-semibold shrink-0 transition-colors cursor-pointer ${
                selectedChapterId === "all"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <span>{language === "hi" ? "सभी प्रश्न" : "All Questions"}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold transition-colors ${
                  selectedChapterId === "all"
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                }`}
              >
                {stats.totalAnswered}/{questions.length}
              </span>
              {selectedChapterId === "all" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-500 rounded-full" />
              )}
            </button>
          )}

          {/* Chapter Tabs */}
          {chapterGroups.map((group) => {
            const isSelected =
              selectedChapterId === group.id ||
              (chapterGroups.length === 1 && selectedChapterId === "all");
            const title =
              language === "hi" && group.hindiTitle
                ? group.hindiTitle
                : group.title;

            return (
              <button
                key={group.id}
                onClick={() => handleChapterTabClick(group.id)}
                className={`relative flex items-center gap-2 px-3 py-1.5 font-semibold shrink-0 transition-colors cursor-pointer ${
                  isSelected
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                <span className="truncate max-w-[180px] sm:max-w-[240px] md:max-w-none">
                  {title}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold transition-colors ${
                    isSelected
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  {group.answeredCount}/{group.totalCount}
                </span>
                {isSelected && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-500 rounded-full" />
                )}
              </button>
            );
          })}

          <div className="text-slate-400 dark:text-slate-600 px-2 hidden lg:block">
            |
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 hidden lg:flex items-center gap-3 shrink-0 ml-auto">
            <span>
              Total Marks:{" "}
              <strong className="text-slate-800 dark:text-slate-200">
                {questions.length}
              </strong>
            </span>
            {item.negative_marking_enabled ? (
              <span className="text-rose-600 dark:text-rose-400">
                Negative: -{item.negative_marks}
              </span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                No Negative Marking
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── MAIN WORKSPACE (Question on Left + Palette on Right) ── */}
      <main className="flex-1 flex overflow-hidden min-h-0 relative">
        {/* ── LEFT: QUESTION & ACTION COLUMN ── */}
        <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0 bg-[#F5F7FA] dark:bg-[#090B14]">
          {/* Question Metadata Bar */}
          <div className="shrink-0 px-4 sm:px-6 py-2.5 sm:py-3 bg-white/70 dark:bg-[#101524]/70 backdrop-blur-xs border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2">
            {/* Question Counter + Chapter Badge */}
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 shrink-0">
                Question {currentIndex + 1} of {questions.length}
              </span>
              {currentQuestionChapterName && (
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-medium truncate max-w-[200px] sm:max-w-xs">
                  {currentQuestionChapterName}
                </span>
              )}
            </div>

            {/* Quick Actions & Language Toggle */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Mark for Review Toggle */}
              <button
                onClick={toggleFlag}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  currentAnswer.isFlagged
                    ? "bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200 dark:border-rose-800"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                <Bookmark
                  className={`w-3.5 h-3.5 ${currentAnswer.isFlagged ? "fill-rose-600 dark:fill-rose-400" : ""}`}
                />
                <span className="hidden sm:inline">
                  {currentAnswer.isFlagged
                    ? "Marked for Review"
                    : "Mark for Review"}
                </span>
              </button>

              {/* Report button */}
              <button
                onClick={() => {
                  setReportSuccess(false);
                  setShowReportModal(true);
                }}
                className="hidden sm:flex items-center gap-1 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 text-xs font-medium cursor-pointer"
              >
                <Info className="w-3.5 h-3.5" />
                <span>Report</span>
              </button>

              {/* Language Switcher (Segmented Control matching image) */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-500 dark:text-slate-400 hidden md:inline font-medium">
                  Language:
                </span>
                <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => handleLanguageChange("en")}
                    className={`px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-semibold transition-colors cursor-pointer ${
                      language === "en"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => handleLanguageChange("hi")}
                    className={`px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-semibold transition-colors cursor-pointer ${
                      language === "hi"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    Hindi
                  </button>
                  <button
                    onClick={() => handleLanguageChange("both")}
                    className={`px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-semibold transition-colors cursor-pointer ${
                      language === "both"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    Bilingual
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── QUESTION SCROLLABLE CONTENT (Fixed viewport, inner scroll) ── */}
          <div
            ref={questionScrollRef}
            className="w-full flex-1 overflow-y-auto scrollbar-thin"
          >
            <div className="w-full p-4 sm:p-6 lg:p-8 space-y-6">
              {/* Question Text Area */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    {(language === "en" || language === "both") && (
                      <h2 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-snug">
                        {currentQuestion.question_en}
                      </h2>
                    )}

                    {(language === "hi" || language === "both") &&
                      currentQuestion.question_hi && (
                        <h3
                          className={`text-sm sm:text-base md:text-lg font-medium text-slate-800 dark:text-slate-200 leading-relaxed ${
                            language === "both" ? "pt-1" : ""
                          }`}
                          lang="hi"
                        >
                          {currentQuestion.question_hi}
                        </h3>
                      )}
                  </div>
                </div>
              </div>

              {/* Options List */}
              <div className="space-y-3 pt-2">
                {(["A", "B", "C", "D"] as const).map((key) => {
                  const opt = getOption(currentQuestion, key);
                  const isSelected = currentAnswer.selectedOption === key;

                  return (
                    <button
                      key={key}
                      onClick={() => selectOption(key)}
                      className={`w-full text-left p-3.5 sm:p-4 rounded-xl md:rounded-2xl border transition-all duration-150 flex items-center gap-3.5 sm:gap-4 cursor-pointer ${
                        isSelected
                          ? "border-2 border-blue-600 dark:border-blue-500 bg-blue-50/40 dark:bg-blue-950/30 shadow-xs"
                          : "border-slate-200 dark:border-slate-800/90 bg-white dark:bg-[#141728] hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 shadow-xs"
                      }`}
                    >
                      {/* Option Indicator Badge (A, B, C, D) */}
                      <div
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 transition-all ${
                          isSelected
                            ? "bg-blue-600 text-white shadow-xs"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {key}
                      </div>

                      {/* Option Text */}
                      <div className="flex-1 min-w-0">
                        {(language === "en" || language === "both") && (
                          <p className="text-sm sm:text-base font-medium text-slate-800 dark:text-slate-200 leading-snug">
                            {opt.en}
                          </p>
                        )}
                        {language === "both" && opt.hi && (
                          <p
                            className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 leading-snug"
                            lang="hi"
                          >
                            {opt.hi}
                          </p>
                        )}
                        {language === "hi" && opt.hi && (
                          <p
                            className="text-sm sm:text-base font-medium text-slate-800 dark:text-slate-200 leading-snug"
                            lang="hi"
                          >
                            {opt.hi}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── FIXED BOTTOM ACTION BAR ── */}
          <div className="shrink-0 px-4 sm:px-6 py-3 bg-white dark:bg-[#101524] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 sm:gap-4 shadow-lg z-20">
            {/* Left: Previous Button */}
            <div>
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="bg-white dark:bg-[#141728] border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
            </div>

            {/* Center on Mobile: Floating Hamburger / Palette Sidenav Trigger */}
            <div className="md:hidden">
              <button
                onClick={() => setMobilePaletteOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-transform active:scale-95 cursor-pointer"
                aria-label="Open Question Palette"
              >
                <LayoutGrid className="w-4 h-4" />
                <span>
                  ({stats.totalAnswered}/{questions.length})
                </span>
              </button>
            </div>

            {/* Right Action Group: Clear + Mark + Save & Next */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Clear Response */}
              <button
                onClick={clearCurrentResponse}
                disabled={currentAnswer.selectedOption === null}
                className="hidden sm:flex bg-white dark:bg-[#141728] border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 px-3.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium items-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <Eraser className="w-4 h-4 text-slate-500" />
                <span>Clear Response</span>
              </button>

              {/* Mark for Review Button */}
              <button
                onClick={toggleFlag}
                className="hidden sm:flex bg-white dark:bg-[#141728] border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 px-3.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Bookmark
                  className={`w-4 h-4 ${currentAnswer.isFlagged ? "fill-rose-500 text-rose-500" : "text-slate-500"}`}
                />
                <span>
                  {currentAnswer.isFlagged ? "Unmark" : "Mark for Review"}
                </span>
              </button>

              {/* Save & Next (Solid Blue Button matching image) */}
              <button
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <span>
                  {currentIndex === questions.length - 1
                    ? "Submit Test"
                    : "Save & Next"}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ── RIGHT: DESKTOP QUESTION PALETTE (Fixed outer, inner scroll) ── */}
        <aside className="hidden md:flex flex-col w-80 lg:w-96 shrink-0 h-full p-1 overflow-hidden border-l border-slate-200/80 dark:border-slate-800 bg-[#F5F7FA] dark:bg-[#090B14]">
          <div className="bg-white dark:bg-[#141728] border border-slate-200 dark:border-slate-800/90  shadow-xs flex flex-col h-full overflow-hidden p-4 sm:p-5">
            {/* Palette Header */}
            <div className="shrink-0 flex items-center justify-between gap-2 mb-3.5">
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Question Palette
                </h2>
              </div>
              {selectedChapterId !== "all" && chapterGroups.length > 1 && (
                <button
                  onClick={() => setSelectedChapterId("all")}
                  className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  Show All ({questions.length})
                </button>
              )}
            </div>

            {/* Legend (2x2 grid matching reference screenshot) */}
            <div className="shrink-0 grid grid-cols-2 gap-y-2 gap-x-2 text-[11px] text-slate-600 dark:text-slate-300 pb-3.5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-md bg-emerald-500 shrink-0" />
                <span className="truncate">Answered ({stats.answered})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0" />
                <span className="truncate">
                  Not Answered ({stats.notAnswered})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-md bg-rose-500 shrink-0" />
                <span className="truncate">Marked ({stats.marked})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-md bg-purple-600 shrink-0" />
                <span className="truncate">
                  Marked & Answered ({stats.markedAndAnswered})
                </span>
              </div>
            </div>

            {/* Palette Number Grid (Internally scrollable, supports chapter filter) */}
            <div
              ref={paletteScrollRef}
              className="flex-1 overflow-y-auto pr-1 pt-3.5 scrollbar-thin"
            >
              <div className="grid grid-cols-7 gap-2">
                {visibleQuestionIndices.map((origIdx) => (
                  <button
                    key={origIdx}
                    onClick={() => navigate(origIdx)}
                    className={`aspect-square rounded-xl text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${getPaletteCellClass(
                      origIdx,
                    )}`}
                    aria-label={`Go to question ${origIdx + 1}`}
                  >
                    {origIdx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Palette Bottom Quick Submit Button */}
            <div className="shrink-0 pt-3 border-t border-slate-100 dark:border-slate-800 mt-2">
              <button
                onClick={() => setShowSubmitConfirmModal(true)}
                className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Flag className="w-3.5 h-3.5 text-slate-400" />
                <span>Submit Assessment</span>
              </button>
            </div>
          </div>
        </aside>

        {/* ── MOBILE SIDENAV DRAWER FOR QUESTION PALETTE ── */}
        {mobilePaletteOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex justify-end">
            {/* Backdrop */}
            <div
              onClick={() => setMobilePaletteOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            />

            {/* Drawer Panel */}
            <div className="relative w-full max-w-xs h-full bg-white dark:bg-[#141728] shadow-2xl flex flex-col z-10 overflow-hidden animate-in slide-in-from-right duration-200">
              {/* Drawer Header */}
              <div className="shrink-0 p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
                <div className="flex items-center gap-2">
                  <LayoutGrid className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Question Palette
                  </h3>
                </div>
                <button
                  onClick={() => setMobilePaletteOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Drawer Chapter Filter Chips */}
              {chapterGroups.length > 1 && (
                <div className="shrink-0 p-2.5 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                  <button
                    onClick={() => setSelectedChapterId("all")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
                      selectedChapterId === "all"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    All ({questions.length})
                  </button>
                  {chapterGroups.map((g) => {
                    const title =
                      language === "hi" && g.hindiTitle ? g.hindiTitle : g.title;
                    return (
                      <button
                        key={g.id}
                        onClick={() => handleChapterTabClick(g.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
                          selectedChapterId === g.id
                            ? "bg-blue-600 text-white shadow-xs"
                            : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        <span className="truncate max-w-[120px] inline-block align-bottom">{title}</span> ({g.answeredCount}/{g.totalCount})
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Legend in Drawer */}
              <div className="shrink-0 p-4 border-b border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-md bg-emerald-500 shrink-0" />
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-md bg-slate-200 dark:bg-slate-800 shrink-0" />
                  <span>Not Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-md bg-rose-500 shrink-0" />
                  <span>Marked</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-md bg-purple-600 shrink-0" />
                  <span>Marked & Ans</span>
                </div>
              </div>

              {/* Scrollable Questions Grid in Drawer */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="grid grid-cols-6 gap-2">
                  {visibleQuestionIndices.map((origIdx) => (
                    <button
                      key={origIdx}
                      onClick={() => navigate(origIdx)}
                      className={`aspect-square rounded-xl text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${getPaletteCellClass(
                        origIdx,
                      )}`}
                    >
                      {origIdx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Drawer Bottom Action */}
              <div className="shrink-0 p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <button
                  onClick={() => {
                    setMobilePaletteOpen(false);
                    setShowSubmitConfirmModal(true);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors cursor-pointer"
                >
                  Submit Test ({stats.totalAnswered}/{questions.length})
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── PAUSE OVERLAY / MODAL ── */}
      {examState === "paused" && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#141728] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 text-center shadow-2xl space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center mx-auto text-blue-600">
              <Pause className="w-8 h-8 fill-current" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Exam Paused
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                The timer is stopped. Take a deep breath and resume whenever you
                are ready.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={() => setExamState("active")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Resume Exam</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── INSTRUCTIONS MODAL ── */}
      {showInstructionsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#141728] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Exam Instructions
                </h3>
              </div>
              <button
                onClick={() => setShowInstructionsModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 pr-1">
              <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 space-y-1">
                <div className="font-bold text-blue-900 dark:text-blue-300">
                  {item.title}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-blue-700 dark:text-blue-400">
                  <span>
                    Total Questions: <strong>{questions.length}</strong>
                  </span>
                  <span>
                    Duration: <strong>{item.duration} Mins</strong>
                  </span>
                  <span>
                    Total Marks: <strong>{questions.length}</strong>
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Marking Scheme:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Each correct response carries 1 mark.</li>
                  {item.negative_marking_enabled ? (
                    <li className="text-rose-600 dark:text-rose-400 font-semibold">
                      Negative marking of -{item.negative_marks} marks applies
                      for each incorrect answer.
                    </li>
                  ) : (
                    <li className="text-emerald-600 dark:text-emerald-400">
                      No negative marks for incorrect or unattempted questions.
                    </li>
                  )}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Question Palette Color Codes:
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-md bg-emerald-500 shrink-0" />
                    <span>Answered question</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-md bg-slate-200 dark:bg-slate-700 shrink-0" />
                    <span>Unanswered question</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-md bg-rose-500 shrink-0" />
                    <span>Marked for review</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-md bg-purple-600 shrink-0" />
                    <span>Marked & Answered</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Navigation & Language:
                </h4>
                <p className="text-xs">
                  You can switch between English, Hindi, and Bilingual modes
                  using the toggle bar on top of the question. You can review
                  and change your answers anytime before final submission.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setShowInstructionsModal(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors cursor-pointer"
              >
                Close & Continue Test
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SUBMIT CONFIRMATION MODAL ── */}
      {showSubmitConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#141728] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Submit Assessment
              </h3>
              <button
                onClick={() => setShowSubmitConfirmModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              Are you sure you want to end and submit your test? Here is your
              current summary:
            </p>

            {/* Summary Statistics Card */}
            <div className="grid grid-cols-2 gap-2.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs">
              <div className="flex justify-between p-2 rounded-lg bg-white dark:bg-[#101524] border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">
                  Total:
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {questions.length}
                </span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400">
                <span>Answered:</span>
                <span className="font-bold">{stats.totalAnswered}</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <span>Unanswered:</span>
                <span className="font-bold">{stats.notAnswered}</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/40 text-rose-700 dark:text-rose-400">
                <span>Marked:</span>
                <span className="font-bold">
                  {stats.marked + stats.markedAndAnswered}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowSubmitConfirmModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                Back to Test
              </button>
              <button
                onClick={handleFinalSubmit}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer shadow-sm"
              >
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── REPORT ISSUE MODAL ── */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#141728] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Report Issue with Question
              </h3>
              <button
                onClick={() => setShowReportModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {reportSuccess ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Thank you! Your feedback has been recorded.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Found a typo, translation error, or incorrect answer? Let us
                  know.
                </p>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Issue Type
                  </label>
                  <select
                    value={reportIssueType}
                    onChange={(e) => setReportIssueType(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                  >
                    <option>Question / Option Error</option>
                    <option>Incorrect Answer Marked</option>
                    <option>Hindi Translation Mismatch</option>
                    <option>Formatting / Display Glitch</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    onClick={() => setShowReportModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setReportSuccess(true)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer"
                  >
                    Submit Report
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── RESULT SCREEN (CCC Exam) ──
function ResultScreen({
  result,
  questions,
  item,
  seriesSlug,
  seriesId,
  chapters,
  initialLang = "en",
  onReattempt,
}: {
  result: ExamResult;
  questions: Question[];
  item: TestSeriesItem;
  seriesSlug?: string;
  seriesId?: string;
  chapters?: Chapter[];
  initialLang?: Language;
  onReattempt: () => void;
}) {
  const [showReview, setShowReview] = useState(false);
  const [reviewLang, setReviewLang] = useState<Language>(initialLang);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "correct" | "wrong" | "skipped"
  >("all");

  // Share & Screenshot states
  const [showShareModal, setShowShareModal] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [scorecardDataUrl, setScorecardDataUrl] = useState<string | null>(null);
  const [scorecardBlob, setScorecardBlob] = useState<Blob | null>(null);
  const [copiedText, setCopiedText] = useState(false);
  const [shareUrl, setShareUrl] = useState("https://cccguru.in");
  const scorecardRef = useRef<HTMLDivElement>(null);

  const totalQuestions = questions.length;
  // Calculate percentage dynamically based on actual question data size
  const percentage =
    totalQuestions > 0
      ? Math.max(
          0,
          Math.min(100, Math.round((result.score / totalQuestions) * 100)),
        )
      : 0;

  // Resolve dynamic current URL for sharing
  useEffect(() => {
    if (typeof window !== "undefined") {
      const origin = window.location.origin;
      if (seriesSlug) {
        setShareUrl(`${origin}/test-series/${seriesSlug}`);
      } else {
        setShareUrl(origin);
      }
    }
  }, [seriesSlug]);

  // NIELIT CCC Official Grading Scale:
  // S: >= 85%, A: 75-84%, B: 65-74%, C: 55-64%, D: 50-54%, Fail: < 50%
  const getCCCGrade = (pct: number) => {
    if (pct >= 85) {
      return {
        grade: "S",
        title: "Super / Exemplary",
        hindiTitle: "उत्कृष्ट (सुपर)",
        color: "text-amber-500",
        badgeBg: "bg-amber-500 text-slate-950",
        border: "border-amber-400",
        glow: "shadow-amber-500/20",
        passed: true,
        desc: "Exemplary performance! Highest grade achieved.",
      };
    }
    if (pct >= 75) {
      return {
        grade: "A",
        title: "Excellent",
        hindiTitle: "अति उत्तम (एक्सीलेंट)",
        color: "text-emerald-500",
        badgeBg: "bg-emerald-500 text-white",
        border: "border-emerald-400",
        glow: "shadow-emerald-500/20",
        passed: true,
        desc: "Outstanding score! Qualified with distinction.",
      };
    }
    if (pct >= 65) {
      return {
        grade: "B",
        title: "Good",
        hindiTitle: "उत्तम (गुड)",
        color: "text-blue-500",
        badgeBg: "bg-blue-600 text-white",
        border: "border-blue-400",
        glow: "shadow-blue-500/20",
        passed: true,
        desc: "Good command over computer concepts and applications.",
      };
    }
    if (pct >= 55) {
      return {
        grade: "C",
        title: "Satisfactory",
        hindiTitle: "संतोषजनक",
        color: "text-indigo-500",
        badgeBg: "bg-indigo-600 text-white",
        border: "border-indigo-400",
        glow: "shadow-indigo-500/20",
        passed: true,
        desc: "Satisfactory score. Successfully qualified the exam.",
      };
    }
    if (pct >= 50) {
      return {
        grade: "D",
        title: "Pass",
        hindiTitle: "उत्तीर्ण (पास)",
        color: "text-teal-600 dark:text-teal-400",
        badgeBg: "bg-teal-600 text-white",
        border: "border-teal-400",
        glow: "shadow-teal-500/20",
        passed: true,
        desc: "Met the minimum qualifying score (50%) to pass.",
      };
    }
    return {
      grade: "F",
      title: "Failed",
      hindiTitle: "अनुत्तीर्ण (फेल)",
      color: "text-rose-500",
      badgeBg: "bg-rose-600 text-white",
      border: "border-rose-400",
      glow: "shadow-rose-500/20",
      passed: false,
      desc: "Score below 50%. Minimum 50% required to qualify.",
    };
  };

  const userGrade = getCCCGrade(percentage);

  // All 6 CCC Exam Grades
  const cccGradeScale = [
    {
      grade: "S",
      range: "85% – 100%",
      label: "Super",
      hindiLabel: "सुपर",
      min: 85,
    },
    {
      grade: "A",
      range: "75% – 84%",
      label: "Excellent",
      hindiLabel: "अति उत्तम",
      min: 75,
    },
    {
      grade: "B",
      range: "65% – 74%",
      label: "Good",
      hindiLabel: "उत्तम",
      min: 65,
    },
    {
      grade: "C",
      range: "55% – 64%",
      label: "Satisfactory",
      hindiLabel: "संतोषजनक",
      min: 55,
    },
    {
      grade: "D",
      range: "50% – 54%",
      label: "Pass",
      hindiLabel: "पास",
      min: 50,
    },
    {
      grade: "F",
      range: "Below 50%",
      label: "Failed",
      hindiLabel: "फेल",
      min: 0,
    },
  ];

  // Section / Chapter wise breakdown calculation
  const sectionBreakdown = useMemo(() => {
    const map = new Map<
      string,
      {
        id: string;
        title: string;
        hindiTitle?: string;
        total: number;
        correct: number;
        wrong: number;
        skipped: number;
        score: number;
      }
    >();

    questions.forEach((q, i) => {
      const cid = q.chapter_id || "general";
      if (!map.has(cid)) {
        const chap = chapters?.find((c) => c.id === cid);
        map.set(cid, {
          id: cid,
          title:
            chap?.title || (cid === "general" ? "General / Mixed" : "Chapter"),
          hindiTitle: chap?.hindi_title,
          total: 0,
          correct: 0,
          wrong: 0,
          skipped: 0,
          score: 0,
        });
      }

      const sec = map.get(cid)!;
      sec.total++;
      const ans = result.answers[i];
      if (!ans || ans.selectedOption === null) {
        sec.skipped++;
      } else if (ans.selectedOption === q.correct_option) {
        sec.correct++;
        sec.score++;
      } else {
        sec.wrong++;
      }
    });

    return Array.from(map.values());
  }, [questions, chapters, result.answers]);

  // Filter solutions questions based on status filter
  const filteredSolutions = useMemo(() => {
    return questions
      .map((q, i) => ({ q, index: i, ans: result.answers[i] }))
      .filter(({ q, ans }) => {
        if (statusFilter === "all") return true;
        const isCorrect = ans?.selectedOption === q.correct_option;
        const isSkipped = !ans || ans.selectedOption === null;
        if (statusFilter === "correct") return isCorrect;
        if (statusFilter === "wrong") return !isCorrect && !isSkipped;
        if (statusFilter === "skipped") return isSkipped;
        return true;
      });
  }, [questions, result.answers, statusFilter]);

  // Rich text + emoji share message
  const shareMessage = useMemo(() => {
    return `🏆 *CCC Exam Mock Test Result* 🏆
Platform: CCC GURU (cccguru.in)

📝 *Test:* ${item.title}
🎯 *Score:* ${result.score}/${totalQuestions} (${percentage}%)
🎖️ *Grade:* Grade ${userGrade.grade} (${userGrade.title})
📊 *Accuracy:* ${result.accuracy}%
⏱️ *Time Taken:* ${formatTimer(result.timeTaken)}
📜 *Status:* ${userGrade.passed ? "QUALIFIED 🎉" : "PRACTICED 📚"}

Practice free CCC mock tests & chapter tests:
👉 ${shareUrl}`;
  }, [
    item.title,
    result.score,
    totalQuestions,
    percentage,
    userGrade,
    result.accuracy,
    result.timeTaken,
    shareUrl,
  ]);

  // Generate Scorecard Image from DOM using html-to-image
  const generateScorecardImage = useCallback(async () => {
    if (!scorecardRef.current) return;
    setIsGeneratingImage(true);
    try {
      const { toPng, toBlob } = await import("html-to-image");
      // Allow DOM fonts and elements to settle
      await new Promise((r) => setTimeout(r, 120));

      const isDark = document.documentElement.classList.contains("dark");
      const bgColor = isDark ? "#141728" : "#ffffff";

      const filterFn = (node: HTMLElement) => {
        if (node?.classList?.contains?.("no-export")) {
          return false;
        }
        return true;
      };

      const dataUrl = await toPng(scorecardRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: bgColor,
        filter: filterFn,
        style: {
          borderRadius: "24px",
        },
      });

      const blob = await toBlob(scorecardRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: bgColor,
        filter: filterFn,
        style: {
          borderRadius: "24px",
        },
      });

      setScorecardDataUrl(dataUrl);
      setScorecardBlob(blob);
    } catch (err) {
      console.error("Failed to generate scorecard image:", err);
    } finally {
      setIsGeneratingImage(false);
    }
  }, []);

  const handleOpenShare = () => {
    setShowShareModal(true);
    setCopiedText(false);
    if (!scorecardDataUrl) {
      generateScorecardImage();
    }
  };

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(shareMessage);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, "_blank");
  };

  const handleNativeShare = async () => {
    if (typeof navigator === "undefined" || !navigator.share) {
      handleWhatsAppShare();
      return;
    }
    try {
      if (scorecardBlob && navigator.canShare) {
        const fileName = `CCC_Scorecard_${item.title.replace(/[^a-zA-Z0-9]/g, "_")}.png`;
        const file = new File([scorecardBlob], fileName, { type: "image/png" });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `CCC Exam Result - ${item.title}`,
            text: shareMessage,
            files: [file],
          });
          return;
        }
      }
      await navigator.share({
        title: `CCC Exam Result - ${item.title}`,
        text: shareMessage,
        url: shareUrl,
      });
    } catch (err: any) {
      if (err?.name !== "AbortError") {
        console.error("Native share error:", err);
      }
    }
  };

  const handleDownloadImage = () => {
    if (!scorecardDataUrl) return;
    const link = document.createElement("a");
    link.download = `CCC_Scorecard_${item.title.replace(/[^a-zA-Z0-9]/g, "_")}.png`;
    link.href = scorecardDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(shareMessage);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#090B14] py-6 sm:py-10 px-3 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* ── CCC RESULT HERO CERTIFICATE CARD ── */}
        <div
          ref={scorecardRef}
          className="bg-white dark:bg-[#141728] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden"
        >
          {/* Subtle Ambient Background Glow */}
          <div
            className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none opacity-20 ${
              userGrade.passed ? "bg-emerald-500" : "bg-rose-500"
            }`}
          />

          {/* Card Header: Scorecard Branding */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-100 dark:border-slate-800 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    CCC Online Examination Scorecard
                  </span>
                </div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h1>
              </div>
            </div>

            {/* Right Header: Share Button + Qualified Status Badge */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenShare}
                className="no-export inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors cursor-pointer"
                title="Share Result Scorecard"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>

              <div
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-black tracking-wide uppercase shadow-xs ${
                  userGrade.passed
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                    : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800"
                }`}
              >
                {userGrade.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                )}
                <span>{userGrade.passed ? "QUALIFIED" : "NOT QUALIFIED"}</span>
              </div>
            </div>
          </div>

          {/* Hero Grade & Score Summary */}
          <div className="py-6 sm:py-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            {/* Left: User Awarded Grade */}
            <div className="flex items-center gap-5 text-center md:text-left">
              <div
                className={`w-24 h-24 sm:w-28 sm:h-28 rounded-3xl flex flex-col items-center justify-center shadow-lg shrink-0 border-2 ${
                  userGrade.passed
                    ? "bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white border-blue-400/40"
                    : "bg-gradient-to-br from-rose-600 to-red-700 text-white border-rose-400/40"
                }`}
              >
                <Award className="w-6 h-6 mb-1 opacity-90" />
                <span className="text-3xl sm:text-4xl font-black leading-none tracking-tight">
                  {userGrade.grade}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider mt-1 opacity-80">
                  Grade
                </span>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Overall Performance Grade
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  Grade {userGrade.grade} ({userGrade.title})
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md">
                  {userGrade.desc}
                </p>
              </div>
            </div>

            {/* Right: Score and Percentage */}
            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 rounded-2xl shrink-0 w-full md:w-auto justify-around md:justify-start">
              <div className="text-center px-3">
                <div className="text-3xl sm:text-4xl font-black text-blue-600 dark:text-blue-400">
                  {percentage}%
                </div>
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">
                  Percentage
                </div>
              </div>
              <div className="h-10 w-px bg-slate-200 dark:bg-slate-700" />
              <div className="text-center px-3">
                <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                  {result.score}
                  <span className="text-base sm:text-lg text-slate-400 font-normal">
                    /{totalQuestions}
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">
                  Total Marks
                </div>
              </div>
            </div>
          </div>

          {/* ── ALL CCC GRADES MATRIX ── */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 relative z-10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-600" />
                <span>CCC Exam Grading System</span>
              </h3>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Minimum 50% required to pass
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {cccGradeScale.map((g) => {
                const isUserGrade = userGrade.grade === g.grade;

                return (
                  <div
                    key={g.grade}
                    className={`p-3 rounded-2xl border text-center transition-all relative ${
                      isUserGrade
                        ? "bg-blue-50 dark:bg-blue-950/60 border-2 border-blue-600 dark:border-blue-400 shadow-md ring-2 ring-blue-500/20"
                        : "bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80"
                    }`}
                  >
                    {isUserGrade && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-blue-600 text-white shadow-xs">
                        Your Grade
                      </span>
                    )}
                    <div
                      className={`text-xl sm:text-2xl font-black ${
                        isUserGrade
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {g.grade}
                    </div>
                    <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                      {g.range}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {g.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Scorecard Footer (captured in screenshot) */}
          <div className="pt-4 mt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
              <Award className="w-4 h-4 text-blue-600" />
              <span>CCC Exam • Candidate Scorecard</span>
            </div>
            <span className="text-[11px] text-blue-600 dark:text-blue-400 font-bold">
              Practice Free at cccguru.in
            </span>
          </div>
        </div>

        {/* ── CORE ANALYTICS STATS (6 CARDS) ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            {
              label: "Questions",
              value: questions.length,
              color: "text-slate-900 dark:text-white",
              bg: "bg-white dark:bg-[#141728] border-slate-200 dark:border-slate-800",
            },
            {
              label: "Correct",
              value: result.correct,
              color: "text-emerald-600 dark:text-emerald-400",
              bg: "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60",
            },
            {
              label: "Wrong",
              value: result.wrong,
              color: "text-rose-600 dark:text-rose-400",
              bg: "bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/60",
            },
            {
              label: "Skipped",
              value: result.skipped,
              color: "text-amber-600 dark:text-amber-400",
              bg: "bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/60",
            },
            {
              label: "Accuracy",
              value: `${result.accuracy}%`,
              color: "text-blue-600 dark:text-blue-400",
              bg: "bg-blue-50/70 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/60",
            },
            {
              label: "Time Taken",
              value: formatTimer(result.timeTaken),
              color: "text-slate-800 dark:text-slate-200 font-mono",
              bg: "bg-white dark:bg-[#141728] border-slate-200 dark:border-slate-800",
            },
          ].map(({ label, value, color, bg }) => (
            <div
              key={label}
              className={`p-4 rounded-2xl border text-center shadow-xs ${bg}`}
            >
              <div className={`text-xl sm:text-2xl font-black ${color}`}>
                {value}
              </div>
              <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mt-1">
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* ── SECTION-WISE / CHAPTER-WISE PERFORMANCE ── */}
        <div className="bg-white dark:bg-[#141728] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Chapter / Section-wise Performance
              </h2>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {sectionBreakdown.length} Topics Evaluated
            </span>
          </div>

          <div className="space-y-3">
            {sectionBreakdown.map((sec) => {
              const secPct =
                sec.total > 0 ? Math.round((sec.correct / sec.total) * 100) : 0;

              return (
                <div
                  key={sec.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 space-y-2.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        {sec.title}
                      </h4>
                      {sec.hindiTitle && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {sec.hindiTitle}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                        {sec.correct} Correct
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400">
                        {sec.wrong} Wrong
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400">
                        {sec.skipped} Skipped
                      </span>
                      <span className="text-slate-700 dark:text-slate-300 font-bold ml-1">
                        {secPct}%
                      </span>
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        secPct >= 75
                          ? "bg-emerald-500"
                          : secPct >= 50
                            ? "bg-blue-600"
                            : "bg-rose-500"
                      }`}
                      style={{ width: `${secPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── ACTION BUTTONS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={handleOpenShare}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md hover:shadow-lg active:scale-98"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Result</span>
          </button>
          <button
            onClick={() => setShowReview(!showReview)}
            className="bg-white dark:bg-[#141728] border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Eye className="w-4 h-4 text-blue-600" />
            <span>
              {showReview ? "Hide Solutions" : "View Solutions"}
            </span>
          </button>
          <button
            onClick={onReattempt}
            className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reattempt Exam</span>
          </button>
          <Link
            href={`/test-series/${seriesSlug || seriesId}`}
            className="bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-colors text-center"
          >
            <Home className="w-4 h-4" />
            <span>All Tests</span>
          </Link>
        </div>

        {/* ── DETAILED SOLUTIONS REVIEW ── */}
        {showReview && (
          <div className="bg-white dark:bg-[#141728] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xs space-y-6">
            {/* Solutions Header with Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <span>Question Solutions & Explanations</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Showing {filteredSolutions.length} of {questions.length}{" "}
                  questions
                </p>
              </div>

              {/* Language Switcher */}
              <div className="flex items-center gap-1.5 self-start md:self-auto">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1">
                  Language:
                </span>
                <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                  <button
                    onClick={() => setReviewLang("en")}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                      reviewLang === "en"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setReviewLang("hi")}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                      reviewLang === "hi"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    Hindi
                  </button>
                  <button
                    onClick={() => setReviewLang("both")}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                      reviewLang === "both"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    Bilingual
                  </button>
                </div>
              </div>
            </div>

            {/* Status Filter Chips */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1">
                Filter:
              </span>
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === "all"
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                All ({questions.length})
              </button>
              <button
                onClick={() => setStatusFilter("correct")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === "correct"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100"
                }`}
              >
                ✓ Correct ({result.correct})
              </button>
              <button
                onClick={() => setStatusFilter("wrong")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === "wrong"
                    ? "bg-rose-600 text-white shadow-xs"
                    : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800 hover:bg-rose-100"
                }`}
              >
                ✕ Wrong ({result.wrong})
              </button>
              <button
                onClick={() => setStatusFilter("skipped")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === "skipped"
                    ? "bg-amber-500 text-white shadow-xs"
                    : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 hover:bg-amber-100"
                }`}
              >
                ⚠ Skipped ({result.skipped})
              </button>
            </div>

            {/* Filtered Questions List */}
            {filteredSolutions.length === 0 ? (
              <div className="py-12 text-center text-slate-500 dark:text-slate-400">
                <p className="text-sm font-semibold">
                  No questions found for the selected filter ({statusFilter}).
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {filteredSolutions.map(({ q, index, ans }) => {
                  const isCorrect = ans?.selectedOption === q.correct_option;
                  const isSkipped = !ans || ans.selectedOption === null;
                  const chap = chapters?.find((c) => c.id === q.chapter_id);

                  return (
                    <div
                      key={q.id}
                      className={`p-5 sm:p-6 rounded-2xl border bg-white dark:bg-[#101524] shadow-xs transition-all ${
                        isSkipped
                          ? "border-amber-300 dark:border-amber-800/80"
                          : isCorrect
                            ? "border-emerald-300 dark:border-emerald-800/80"
                            : "border-rose-300 dark:border-rose-800/80"
                      }`}
                    >
                      {/* Question Top Meta */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                            Question {index + 1}
                          </span>
                          {chap && (
                            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate max-w-[220px]">
                              {reviewLang === "hi" && chap.hindi_title
                                ? chap.hindi_title
                                : chap.title}
                            </span>
                          )}
                        </div>

                        {/* Status Badge */}
                        <div>
                          {isSkipped ? (
                            <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-lg font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                              <AlertCircle className="w-3.5 h-3.5" />
                              <span>Not Attempted (0)</span>
                            </span>
                          ) : isCorrect ? (
                            <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-lg font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Correct (+1)</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-lg font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                              <XCircle className="w-3.5 h-3.5" />
                              <span>
                                Incorrect{" "}
                                {item.negative_marking_enabled
                                  ? `(-${item.negative_marks})`
                                  : "(0)"}
                              </span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Question Text */}
                      <div className="space-y-1 mb-4">
                        {(reviewLang === "en" || reviewLang === "both") && (
                          <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                            {q.question_en}
                          </p>
                        )}
                        {(reviewLang === "hi" || reviewLang === "both") &&
                          q.question_hi && (
                            <p
                              className={`text-sm sm:text-base font-medium text-slate-800 dark:text-slate-200 leading-relaxed ${
                                reviewLang === "both" ? "pt-1" : ""
                              }`}
                              lang="hi"
                            >
                              {q.question_hi}
                            </p>
                          )}
                      </div>

                      {/* Options Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                        {(["A", "B", "C", "D"] as const).map((key) => {
                          const optEn = {
                            A: q.option_a_en,
                            B: q.option_b_en,
                            C: q.option_c_en,
                            D: q.option_d_en,
                          }[key];
                          const optHi = {
                            A: q.option_a_hi,
                            B: q.option_b_hi,
                            C: q.option_c_hi,
                            D: q.option_d_hi,
                          }[key];

                          const isCorrectOpt = key === q.correct_option;
                          const isUserSelected = key === ans?.selectedOption;

                          return (
                            <div
                              key={key}
                              className={`p-3 rounded-xl border text-xs flex items-start gap-3 transition-all ${
                                isCorrectOpt
                                  ? "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-400 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200"
                                  : isUserSelected && !isCorrectOpt
                                    ? "bg-rose-50 dark:bg-rose-950/50 border-rose-400 dark:border-rose-700 text-rose-900 dark:text-rose-200"
                                    : "bg-slate-50/70 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                              }`}
                            >
                              <span
                                className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                                  isCorrectOpt
                                    ? "bg-emerald-600 text-white"
                                    : isUserSelected && !isCorrectOpt
                                      ? "bg-rose-600 text-white"
                                      : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                                }`}
                              >
                                {key}
                              </span>

                              <div className="flex-1 min-w-0">
                                {(reviewLang === "en" ||
                                  reviewLang === "both") && (
                                  <p className="font-semibold">{optEn}</p>
                                )}
                                {(reviewLang === "hi" ||
                                  reviewLang === "both") &&
                                  optHi && (
                                    <p
                                      className={`text-slate-600 dark:text-slate-400 ${
                                        reviewLang === "both" ? "mt-0.5" : ""
                                      }`}
                                      lang="hi"
                                    >
                                      {optHi}
                                    </p>
                                  )}
                              </div>

                              {/* Badges */}
                              {isCorrectOpt && (
                                <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-600 text-white">
                                  Correct Answer
                                </span>
                              )}
                              {isUserSelected && !isCorrectOpt && (
                                <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-600 text-white">
                                  Your Choice
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation */}
                      {(q.explanation_en || q.explanation_hi) && (
                        <div className="bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 rounded-xl p-3.5 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                          <div className="font-bold text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Explanation / स्पष्टीकरण:</span>
                          </div>
                          {(reviewLang === "en" || reviewLang === "both") &&
                            q.explanation_en && (
                              <p className="leading-relaxed">
                                {q.explanation_en}
                              </p>
                            )}
                          {(reviewLang === "hi" || reviewLang === "both") &&
                            q.explanation_hi && (
                              <p className="leading-relaxed" lang="hi">
                                {q.explanation_hi}
                              </p>
                            )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── SHARE SCORECARD MODAL ── */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#141728] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Share Your Scorecard
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Share result screenshot, grade & website link
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scorecard Image Capture Preview */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Scorecard Screenshot:
                </span>
                {scorecardDataUrl && (
                  <button
                    onClick={generateScorecardImage}
                    disabled={isGeneratingImage}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer disabled:opacity-50"
                  >
                    Refresh Screenshot
                  </button>
                )}
              </div>

              <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-2 overflow-hidden">
                {isGeneratingImage ? (
                  <div className="h-44 sm:h-52 flex flex-col items-center justify-center gap-2.5 text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                    <span className="text-xs font-semibold">
                      Generating HD Scorecard Screenshot...
                    </span>
                  </div>
                ) : scorecardDataUrl ? (
                  <div className="space-y-2">
                    <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 max-h-52 overflow-y-auto group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={scorecardDataUrl}
                        alt="CCC Scorecard Screenshot"
                        className="w-full h-auto object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <button
                          onClick={handleDownloadImage}
                          className="bg-black/75 hover:bg-black text-white px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-md cursor-pointer backdrop-blur-xs"
                          title="Download Image"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between px-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Screenshot ready to share & download
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-36 flex flex-col items-center justify-center gap-2 text-slate-500">
                    <p className="text-xs">Unable to generate screenshot preview</p>
                    <button
                      onClick={generateScorecardImage}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Retry Capture
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Formatted Text Preview with Emojis */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Share Text & Link:
                </span>
                <button
                  onClick={handleCopyText}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {copiedText ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed max-h-32 overflow-y-auto select-all">
                {shareMessage}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {/* WhatsApp Direct Share */}
              <button
                onClick={handleWhatsAppShare}
                className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Share on WhatsApp</span>
              </button>

              {/* Native App Share (Image + Text on Mobile) */}
              <button
                onClick={handleNativeShare}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Image & Link</span>
              </button>

              {/* Download Scorecard Image */}
              <button
                onClick={handleDownloadImage}
                disabled={!scorecardDataUrl}
                className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-800 dark:text-slate-200 font-semibold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Download className="w-4 h-4 text-slate-500" />
                <span>Download Screenshot</span>
              </button>

              {/* Copy Message & Link */}
              <button
                onClick={handleCopyText}
                className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-800 dark:text-slate-200 font-semibold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {copiedText ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4 text-slate-500" />
                )}
                <span>{copiedText ? "Message Copied!" : "Copy Full Message"}</span>
              </button>
            </div>

            <p className="text-[11px] text-center text-slate-500 dark:text-slate-400 pt-1">
              💡 Tip: On mobile devices, tap <strong className="text-slate-700 dark:text-slate-300">Share Image & Link</strong> to share both the scorecard image and text directly into WhatsApp or Telegram!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
