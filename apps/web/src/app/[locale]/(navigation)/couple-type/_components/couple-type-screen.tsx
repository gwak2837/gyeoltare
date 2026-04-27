"use client";

import { useMemo, useState } from "react";

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

export function CoupleTypeScreen({ content, locale }: CoupleTypeScreenProps) {
  const signUpPath = getLocalizedPath(locale, "/sign-up");

  return (
    <main className="flex flex-1 flex-col overflow-hidden bg-page-bg text-page-ink">
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
