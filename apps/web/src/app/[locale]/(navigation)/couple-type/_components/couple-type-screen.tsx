"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { cn } from "@/component/cn";
import type { Locale } from "@/i18n/config";
import { getLocalizedPath } from "@/i18n/pathnames";

import { calculateCoupleTypeCode } from "../_lib/model";
import type { AxisValue, CoupleTypeAnswers, CoupleTypeContent } from "../_lib/types";
import { QuizView } from "./quiz-view";
import { ResultView } from "./result-view";

type CoupleTypeScreenProps = {
  content: CoupleTypeContent;
  locale: Locale;
};

type CoupleTypeFlowProps = {
  content: CoupleTypeContent;
  locale: Locale;
  signUpPath: ReturnType<typeof getLocalizedPath>;
};

const focusClassName = "focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-page-accent";

export function CoupleTypeScreen({ content, locale }: CoupleTypeScreenProps) {
  const { ui } = content;
  const homePath = getLocalizedPath(locale, "/");
  const signUpPath = getLocalizedPath(locale, "/sign-up");

  return (
    <main className="flex flex-1 flex-col overflow-hidden bg-page-bg text-page-ink">
      <header className="border-page-border/70 border-b bg-page-surface/88 px-[max(1rem,env(safe-area-inset-left))] backdrop-blur-2xl">
        <nav
          aria-label={ui.navigationLabel}
          className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
        >
          <Link
            className={cn("inline-flex items-center gap-3 font-bold text-page-ink", focusClassName)}
            href={homePath}
          >
            <span className="grid h-9 w-9 place-items-center rounded-2xl bg-page-ink text-white shadow-[0_14px_40px_rgba(36,22,23,0.18)]">
              G
            </span>
            <span translate="no">결타래</span>
          </Link>
          <Link
            className={cn(
              "inline-flex min-h-10 items-center justify-center rounded-full border border-page-border bg-white px-4 font-bold text-page-ink/70 text-sm transition-colors hover:text-page-ink",
              focusClassName,
            )}
            href={homePath}
          >
            {ui.homeLink}
          </Link>
        </nav>
      </header>

      <CoupleTypeFlow content={content} locale={locale} signUpPath={signUpPath} />
    </main>
  );
}

function CoupleTypeFlow({ content, locale, signUpPath }: CoupleTypeFlowProps) {
  const { axisDefinitions, questions, results, ui } = content;
  const [answers, setAnswers] = useState<CoupleTypeAnswers>({});
  const [isResultVisible, setIsResultVisible] = useState(false);

  const answeredCount = Object.keys(answers).length;
  const isComplete = answeredCount === questions.length;

  const result = useMemo(() => {
    if (!isComplete) {
      return null;
    }

    const resultCode = calculateCoupleTypeCode({ answers, axisDefinitions, questions });

    return results[resultCode];
  }, [answers, axisDefinitions, isComplete, questions, results]);

  function selectAnswer(questionId: string, value: AxisValue) {
    setAnswers((current) => ({
      ...current,
      [questionId]: value,
    }));
  }

  function showResult() {
    setIsResultVisible(true);
  }

  function restart() {
    setAnswers({});
    setIsResultVisible(false);
  }

  function editAnswers() {
    setIsResultVisible(false);
  }

  return isResultVisible && result ? (
    <ResultView
      answerCount={answeredCount}
      axisDefinitions={axisDefinitions}
      locale={locale}
      onEdit={editAnswers}
      onRestart={restart}
      result={result}
      signUpPath={signUpPath}
      ui={ui}
    />
  ) : (
    <QuizView
      answers={answers}
      axisDefinitions={axisDefinitions}
      locale={locale}
      onComplete={showResult}
      onSelect={selectAnswer}
      questions={questions}
      ui={ui}
    />
  );
}
