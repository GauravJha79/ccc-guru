"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Flag,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  BarChart3,
  RotateCcw,
  Home,
  Eye,
  EyeOff,
} from "lucide-react";
import type {
  TestSeriesItem,
  Question,
  ExamAnswer,
  ExamResult,
} from "@/types/database";
import { formatTimer } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

interface ExamInterfaceProps {
  item: TestSeriesItem;
  questions: Question[];
  seriesId: string;
}

type ExamState = "active" | "submitted";
type Language = "en" | "hi" | "both";

const STORAGE_KEY = "ccc-exam-language-preference";

export function ExamInterface({
  item,
  questions,
  seriesId,
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
  const [reviewMode, setReviewMode] = useState(false);
  const [showNavigator, setShowNavigator] = useState(true);
  const questionStartTime = useRef<number>(Date.now());

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
  const currentAnswer = answers[currentIndex];

  // Timer
  useEffect(() => {
    if (examState !== "active") return;
    if (timeLeft <= 0) {
      handleSubmit();
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

  const toggleFlag = () => {
    setAnswers((prev) =>
      prev.map((a, i) =>
        i === currentIndex ? { ...a, isFlagged: !a.isFlagged } : a,
      ),
    );
  };

  const navigate = (index: number) => {
    updateCurrentTimeSpent();
    questionStartTime.current = Date.now();
    setCurrentIndex(index);
  };

  const handleSubmit = useCallback(() => {
    updateCurrentTimeSpent();

    const finalAnswers = answers;
    let correct = 0;
    let wrong = 0;
    let skipped = 0;
    let score = 0;

    questions.forEach((q, i) => {
      const ans = finalAnswers[i];
      if (ans.selectedOption === null) {
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

    const timeTaken = item.duration * 60 - timeLeft;

    setResult({
      totalQuestions: questions.length,
      attempted: correct + wrong,
      correct,
      wrong,
      skipped,
      score: Math.max(0, score),
      totalMarks: item.total_marks,
      accuracy:
        correct + wrong > 0
          ? Math.round((correct / (correct + wrong)) * 100)
          : 0,
      timeTaken,
      answers: finalAnswers,
    });

    setExamState("submitted");
  }, [answers, questions, item, timeLeft, updateCurrentTimeSpent]);

  // ── Result Screen ──
  if (examState === "submitted" && result) {
    return (
      <ResultScreen
        result={result}
        questions={questions}
        item={item}
        seriesId={seriesId}
        initialLang={language === "hi" ? "hi" : "en"}
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
          setReviewMode(false);
        }}
      />
    );
  }

  // ── Option text helper ──
  const getOption = (q: Question, key: "A" | "B" | "C" | "D") => {
    const map = {
      A: { en: q.option_a_en, hi: q.option_a_hi },
      B: { en: q.option_b_en, hi: q.option_b_hi },
      C: { en: q.option_c_en, hi: q.option_c_hi },
      D: { en: q.option_d_en, hi: q.option_d_hi },
    };
    return map[key];
  };

  // ── Answer state color ──
  const getAnswerStateClass = (i: number) => {
    const a = answers[i];
    if (i === currentIndex)
      return "bg-primary-600 text-white ring-2 ring-primary-400";
    if (a.isFlagged) return "bg-amber-400 text-white";
    if (a.selectedOption) return "bg-emerald-500 text-white";
    return "bg-surface border border-border text-text-muted hover:bg-border-subtle";
  };

  const timerDanger = timeLeft < 5 * 60; // last 5 minutes

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-bg">
      {/* ── Header ── */}
      <header
        className="shrink-0 border-b border-border bg-surface z-10"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <div className="flex items-center gap-3 px-4 py-3">
          {/* Title */}
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold text-text-primary truncate">
              {item.title}
            </h1>
            <p className="text-xs text-text-muted">
              Q {currentIndex + 1} / {questions.length}
            </p>
          </div>

          {/* Timer */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono font-bold text-sm ${
              timerDanger
                ? "bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400"
                : "bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300"
            }`}
          >
            <Clock className="w-4 h-4" />
            {formatTimer(timeLeft)}
          </div>

          {/* Language toggle */}
          <div className="flex border border-border rounded-lg overflow-hidden text-xs font-medium">
            {(["en", "hi", "both"] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`px-1.5 sm:px-2.5 py-1 sm:py-1.5 transition-colors cursor-pointer ${
                  language === lang
                    ? "bg-primary-600 text-white"
                    : "text-text-muted hover:bg-border-subtle"
                }`}
              >
                {lang === "en" ? "EN" : lang === "hi" ? "HI" : "Both"}
              </button>
            ))}
          </div>

          {/* Submit */}
          <button
            onClick={() => {
              if (confirm("Are you sure you want to submit the test?")) {
                handleSubmit();
              }
            }}
            className="btn-primary text-xs py-1.5 px-3"
            id="submit-exam-btn"
          >
            Submit
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-border-subtle">
          <div
            className="h-full bg-primary-500 transition-all duration-300"
            style={{
              width: `${((currentIndex + 1) / questions.length) * 100}%`,
            }}
          />
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Question Panel ── */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 max-w-3xl mx-auto">
            {/* Question flags */}
            <div className="flex items-center justify-between mb-4">
              <Badge
                variant={
                  currentAnswer.selectedOption
                    ? "success"
                    : currentAnswer.isFlagged
                      ? "warning"
                      : "default"
                }
              >
                {currentAnswer.selectedOption
                  ? "✓ Answered"
                  : currentAnswer.isFlagged
                    ? "⚑ Flagged"
                    : "Not Answered"}
              </Badge>
              <button
                onClick={toggleFlag}
                className={`btn-ghost text-xs ${
                  currentAnswer.isFlagged ? "text-amber-500" : "text-text-muted"
                }`}
                aria-label={
                  currentAnswer.isFlagged ? "Remove flag" : "Flag question"
                }
              >
                <Flag className="w-4 h-4" />
                {currentAnswer.isFlagged ? "Unflag" : "Flag"}
              </button>
            </div>

            {/* Question text */}
            <div className="card-elevated rounded-xl p-5 mb-5">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
                Question {currentIndex + 1}
              </p>

              {(language === "en" || language === "both") && (
                <p className="text-base font-medium text-text-primary leading-relaxed mb-2">
                  {currentQuestion.question_en}
                </p>
              )}

              {language === "both" && currentQuestion.question_hi && (
                <hr className="border-border-subtle my-3" />
              )}

              {(language === "hi" || language === "both") &&
                currentQuestion.question_hi && (
                  <p
                    className="text-base font-medium text-text-primary leading-relaxed"
                    lang="hi"
                  >
                    {currentQuestion.question_hi}
                  </p>
                )}
            </div>

            {/* Options */}
            <div className="space-y-3 mb-6">
              {(["A", "B", "C", "D"] as const).map((key) => {
                const opt = getOption(currentQuestion, key);
                const isSelected = currentAnswer.selectedOption === key;

                return (
                  <button
                    key={key}
                    onClick={() => selectOption(key)}
                    className={`
                      w-full text-left p-4 rounded-xl border transition-all duration-150
                      ${
                        isSelected
                          ? "border-primary-500 bg-primary-50 dark:bg-primary-950 text-primary-900 dark:text-primary-100"
                          : "border-border bg-surface text-text-primary hover:border-primary-300 hover:bg-bg-subtle"
                      }
                    `}
                    aria-pressed={isSelected}
                    id={`option-${key}`}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`
                          w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5
                          ${
                            isSelected
                              ? "bg-primary-600 text-white"
                              : "bg-border text-text-muted"
                          }
                        `}
                      >
                        {key}
                      </span>
                      <div>
                        {(language === "en" || language === "both") && (
                          <p className="text-sm leading-relaxed">{opt.en}</p>
                        )}
                        {language === "both" && opt.hi && (
                          <p className="text-xs text-text-muted mt-1" lang="hi">
                            {opt.hi}
                          </p>
                        )}
                        {language === "hi" && opt.hi && (
                          <p className="text-sm leading-relaxed" lang="hi">
                            {opt.hi}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={() => navigate(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0}
                className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <span className="text-sm text-text-muted">
                {currentIndex + 1} / {questions.length}
              </span>

              <button
                onClick={() =>
                  navigate(Math.min(questions.length - 1, currentIndex + 1))
                }
                disabled={currentIndex === questions.length - 1}
                className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Question Navigator (Desktop sidebar) ── */}
        <aside className="hidden md:flex flex-col w-56 border-l border-border bg-surface overflow-hidden shrink-0">
          <div className="p-4 border-b border-border">
            <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
              Question Navigator
            </h2>
            <div className="flex flex-col gap-1.5 text-xs">
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-emerald-500 inline-block" />
                Answered ({answers.filter((a) => a.selectedOption).length})
              </span>
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-amber-400 inline-block" />
                Flagged ({answers.filter((a) => a.isFlagged).length})
              </span>
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-surface border border-border inline-block" />
                Unanswered
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            <div className="grid grid-cols-5 gap-1.5">
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => navigate(i)}
                  className={`
                    w-8 h-8 rounded-md text-xs font-medium transition-all duration-100
                    ${getAnswerStateClass(i)}
                  `}
                  aria-label={`Question ${i + 1}`}
                  aria-current={i === currentIndex ? "true" : undefined}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* ── Mobile bottom navigator toggle ── */}
      <div className="md:hidden border-t border-border bg-surface px-4 py-2">
        <div className="flex gap-1 overflow-x-auto pb-1">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => navigate(i)}
              className={`
                flex-shrink-0 w-8 h-8 rounded-md text-xs font-medium transition-all duration-100
                ${getAnswerStateClass(i)}
              `}
              aria-label={`Question ${i + 1}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Result Screen ──
function ResultScreen({
  result,
  questions,
  item,
  seriesId,
  initialLang = "en",
  onReattempt,
}: {
  result: ExamResult;
  questions: Question[];
  item: TestSeriesItem;
  seriesId: string;
  initialLang?: "en" | "hi";
  onReattempt: () => void;
}) {
  const [showReview, setShowReview] = useState(false);
  const [reviewLang, setReviewLang] = useState<"en" | "hi">(initialLang);

  const passScore = item.total_marks * 0.5;
  const passed = result.score >= passScore;
  const percentage = Math.round((result.score / item.total_marks) * 100);

  return (
    <div className="min-h-screen bg-bg py-8">
      <div className="container-page max-w-3xl">
        {/* Score card */}
        <div
          className="rounded-2xl p-6 md:p-8 text-center mb-6"
          style={{
            background: passed
              ? "linear-gradient(135deg, #6610f2 0%, #1a8fe3 100%)"
              : "linear-gradient(135deg, #96062f 0%, #d11149 100%)",
          }}
        >
          <div className="text-6xl font-black text-white mb-1">
            {percentage}%
          </div>
          <div className="text-primary-200 text-sm mb-3">
            {result.score} / {item.total_marks} marks
          </div>
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold ${
              passed
                ? "bg-emerald-400 text-emerald-900"
                : "bg-red-300 text-red-900"
            }`}
          >
            {passed ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
            {passed ? "Passed!" : "Better luck next time"}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            {
              label: "Correct",
              value: result.correct,
              color: "text-emerald-600 dark:text-emerald-400",
            },
            {
              label: "Wrong",
              value: result.wrong,
              color: "text-red-600 dark:text-red-400",
            },
            {
              label: "Skipped",
              value: result.skipped,
              color: "text-amber-600 dark:text-amber-400",
            },
            {
              label: "Accuracy",
              value: `${result.accuracy}%`,
              color: "text-primary-600 dark:text-primary-400",
            },
          ].map(({ label, value, color }) => (
            <div key={label} className="card p-4 text-center">
              <div className={`text-2xl font-bold ${color}`}>{value}</div>
              <div className="text-xs text-text-muted mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Time taken */}
        <div className="card p-4 flex items-center justify-between mb-6">
          <span className="text-sm text-text-secondary flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary-500" />
            Time Taken
          </span>
          <span className="font-semibold text-text-primary">
            {formatTimer(result.timeTaken)}
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <button
            onClick={() => setShowReview(!showReview)}
            className="btn-secondary flex-1 justify-center"
          >
            <Eye className="w-4 h-4" />
            {showReview ? "Hide Review" : "Review Answers"}
          </button>
          <button
            onClick={onReattempt}
            className="btn-primary flex-1 justify-center"
          >
            <RotateCcw className="w-4 h-4" />
            Reattempt
          </button>
          <Link
            href={`/test-series/${seriesId}`}
            className="btn-ghost flex-1 justify-center"
          >
            <Home className="w-4 h-4" />
            All Tests
          </Link>
        </div>

        {/* Answer Review */}
        {showReview && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-text-primary">
                Answer Review
              </h2>
              <div className="flex border border-border rounded-lg overflow-hidden text-xs">
                {(["en", "hi"] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setReviewLang(lang)}
                    className={`px-3 py-1.5 transition-colors ${
                      reviewLang === lang
                        ? "bg-primary-600 text-white"
                        : "text-text-muted hover:bg-border-subtle"
                    }`}
                  >
                    {lang === "en" ? "English" : "Hindi"}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {questions.map((q, i) => {
                const ans = result.answers[i];
                const isCorrect = ans.selectedOption === q.correct_option;
                const isSkipped = !ans.selectedOption;

                return (
                  <div
                    key={q.id}
                    className={`card p-5 border-l-4 ${
                      isSkipped
                        ? "border-l-amber-400"
                        : isCorrect
                          ? "border-l-emerald-500"
                          : "border-l-red-500"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <p className="text-sm font-medium text-text-primary">
                        <span className="text-text-muted mr-2">{i + 1}.</span>
                        {reviewLang === "en"
                          ? q.question_en
                          : q.question_hi || q.question_en}
                      </p>
                      <span
                        className={`shrink-0 ${
                          isSkipped
                            ? "text-amber-500"
                            : isCorrect
                              ? "text-emerald-500"
                              : "text-red-500"
                        }`}
                      >
                        {isSkipped ? (
                          <AlertCircle className="w-5 h-5" />
                        ) : isCorrect ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <XCircle className="w-5 h-5" />
                        )}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                      {(["A", "B", "C", "D"] as const).map((key) => {
                        const opts = {
                          A:
                            reviewLang === "en"
                              ? q.option_a_en
                              : q.option_a_hi || q.option_a_en,
                          B:
                            reviewLang === "en"
                              ? q.option_b_en
                              : q.option_b_hi || q.option_b_en,
                          C:
                            reviewLang === "en"
                              ? q.option_c_en
                              : q.option_c_hi || q.option_c_en,
                          D:
                            reviewLang === "en"
                              ? q.option_d_en
                              : q.option_d_hi || q.option_d_en,
                        };
                        const isCorrectOpt = key === q.correct_option;
                        const isSelectedOpt = key === ans.selectedOption;

                        return (
                          <div
                            key={key}
                            className={`flex items-start gap-2 p-2.5 rounded-lg text-xs ${
                              isCorrectOpt
                                ? "bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800"
                                : isSelectedOpt && !isCorrectOpt
                                  ? "bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800"
                                  : "bg-bg-subtle border border-transparent"
                            }`}
                          >
                            <span className="font-bold text-text-muted">
                              {key}.
                            </span>
                            <span className="text-text-secondary">
                              {opts[key]}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {(q.explanation_en || q.explanation_hi) && (
                      <div className="bg-primary-50 dark:bg-primary-950 rounded-lg p-3 text-xs text-text-secondary">
                        <span className="font-semibold text-primary-600 dark:text-primary-400">
                          Explanation:{" "}
                        </span>
                        {reviewLang === "en"
                          ? q.explanation_en
                          : q.explanation_hi || q.explanation_en}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
