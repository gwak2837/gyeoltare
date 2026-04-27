"use client";

import { ArrowLeft, ArrowRight, HeartWaves, MessageDots, Refresh, Sparkles } from "@mynaui/icons-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import type { Locale } from "@/i18n/config";
import { getLocalizedPath } from "@/i18n/pathnames";

import { axisDefinitions, axisOrder, coupleTypeQuestions } from "../_lib/questions";
import { coupleTypeResults } from "../_lib/results";
import type { Axis, AxisOption, AxisValue, CoupleTypeCode } from "../_lib/types";

type CoupleTypeScreenProps = {
  locale: Locale;
};

type Answers = Partial<Record<(typeof coupleTypeQuestions)[number]["id"], AxisValue>>;

const focusClassName = "focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-page-accent";
const totalQuestions = coupleTypeQuestions.length;

export function CoupleTypeScreen({ locale }: CoupleTypeScreenProps) {
  const homePath = getLocalizedPath(locale, "/");
  const signUpPath = getLocalizedPath(locale, "/sign-up");
  const [answers, setAnswers] = useState<Answers>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isResultVisible, setIsResultVisible] = useState(false);

  const currentQuestion = coupleTypeQuestions[currentIndex];
  const selectedValue = answers[currentQuestion.id];
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);
  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const isComplete = answeredCount === totalQuestions;
  const resultCode = useMemo(() => (isComplete ? calculateCoupleTypeCode(answers) : null), [answers, isComplete]);
  const result = resultCode ? coupleTypeResults[resultCode] : null;

  function selectAnswer(value: AxisValue) {
    setAnswers((current) => ({
      ...current,
      [currentQuestion.id]: value,
    }));
  }

  function goToPreviousQuestion() {
    setCurrentIndex((index) => Math.max(0, index - 1));
  }

  function goToNextQuestion() {
    if (!selectedValue) {
      return;
    }

    if (isLastQuestion) {
      if (isComplete) {
        setIsResultVisible(true);
      }
      return;
    }

    setCurrentIndex((index) => Math.min(totalQuestions - 1, index + 1));
  }

  function restart() {
    setAnswers({});
    setCurrentIndex(0);
    setIsResultVisible(false);
  }

  function editAnswers() {
    setCurrentIndex(0);
    setIsResultVisible(false);
  }

  return (
    <main className="flex flex-1 flex-col overflow-hidden bg-page-bg text-page-ink">
      <header className="border-page-border/70 border-b bg-page-surface/88 px-[max(1rem,env(safe-area-inset-left))] backdrop-blur-2xl">
        <nav
          aria-label="커플 대화 유형 탐색"
          className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
        >
          <Link className={`inline-flex items-center gap-3 font-bold text-page-ink ${focusClassName}`} href={homePath}>
            <span className="grid h-9 w-9 place-items-center rounded-2xl bg-page-ink text-white shadow-[0_14px_40px_rgba(36,22,23,0.18)]">
              G
            </span>
            <span translate="no">결타래</span>
          </Link>
          <Link
            className={`inline-flex min-h-10 items-center justify-center rounded-full border border-page-border bg-white px-4 font-bold text-page-ink/70 text-sm transition-colors hover:text-page-ink ${focusClassName}`}
            href={homePath}
          >
            홈으로
          </Link>
        </nav>
      </header>

      {isResultVisible && result ? (
        <ResultView
          answers={answers}
          onEdit={editAnswers}
          onRestart={restart}
          result={result}
          signUpPath={signUpPath}
        />
      ) : (
        <QuizView
          answeredCount={answeredCount}
          currentIndex={currentIndex}
          currentQuestion={currentQuestion}
          isComplete={isComplete}
          isFirstQuestion={isFirstQuestion}
          isLastQuestion={isLastQuestion}
          onNext={goToNextQuestion}
          onPrevious={goToPreviousQuestion}
          onSelect={selectAnswer}
          progressPercent={progressPercent}
          selectedValue={selectedValue}
        />
      )}
    </main>
  );
}

function QuizView({
  answeredCount,
  currentIndex,
  currentQuestion,
  isComplete,
  isFirstQuestion,
  isLastQuestion,
  onNext,
  onPrevious,
  onSelect,
  progressPercent,
  selectedValue,
}: {
  answeredCount: number;
  currentIndex: number;
  currentQuestion: (typeof coupleTypeQuestions)[number];
  isComplete: boolean;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onSelect: (value: AxisValue) => void;
  progressPercent: number;
  selectedValue: AxisValue | undefined;
}) {
  const axis = axisDefinitions[currentQuestion.axis];
  const canGoNext = Boolean(selectedValue);

  const nextButtonLabel =
    isLastQuestion && selectedValue && isComplete ? "결과 보기" : selectedValue ? "다음 문항" : "응답 선택하기";

  return (
    <section className="flex flex-1 flex-col justify-center px-[max(1rem,env(safe-area-inset-left))] py-10 sm:py-16">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-8 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="hidden max-w-3xl lg:block">
          <p className="inline-flex items-center gap-2 rounded-full bg-page-ink px-4 py-2 font-bold text-sm text-white">
            <HeartWaves aria-hidden="true" className="h-4 w-4 text-page-accent" stroke={1.8} />
            커플 대화 유형 16종
          </p>
          <h1 className="mt-6 break-keep font-black text-4xl leading-tight lg:text-[2.8rem] xl:text-6xl">
            둘의 대화는 어떤 리듬으로 가까워질까요?
          </h1>
          <p className="mt-5 text-lg text-page-ink/66 leading-8">
            12개의 가벼운 선택으로 둘의 대화 속도, 표현 방식, 회복 리듬, 연결 방식을 살펴봐요. 사람을 단정하지 않고
            지금의 패턴을 읽는 테스트예요.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <MiniStat label="문항" value={`${totalQuestions}개`} />
            <MiniStat label="결과" value="16가지 유형" />
          </div>
        </div>

        <form className="rounded-4xl border-page-border sm:border sm:bg-page-surface sm:p-6 sm:shadow-[0_32px_110px_rgba(36,22,23,0.12)]">
          <div className="flex flex-col gap-4 border-page-border border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-black text-page-accent text-sm">
                {String(currentIndex + 1).padStart(2, "0")} / {String(totalQuestions).padStart(2, "0")}
              </p>
              <p className="mt-1 font-bold text-page-ink/58 text-sm">{axis.label}</p>
            </div>
            <div className="min-w-40">
              <div className="flex items-center justify-between text-page-ink/48 text-xs">
                <span>{answeredCount}개 응답</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-page-soft">
                <div
                  className="h-full rounded-full bg-page-accent transition-[width] duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          <fieldset className="mt-7">
            <legend className="break-keep font-black text-2xl leading-snug">{currentQuestion.question}</legend>
            <div className="mt-6 grid gap-3">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedValue === option.value;

                return (
                  <label
                    className={`group flex cursor-pointer items-start gap-4 rounded-3xl border p-5 transition ${
                      isSelected
                        ? "border-page-accent bg-[#fff3f0] shadow-[0_18px_50px_rgba(255,77,109,0.16)]"
                        : "border-page-border bg-white hover:border-page-accent/50 hover:bg-page-soft/50"
                    }`}
                    key={option.value}
                  >
                    <input
                      checked={isSelected}
                      className="mt-1 h-5 w-5 accent-page-accent"
                      name={currentQuestion.id}
                      onChange={() => onSelect(option.value)}
                      type="radio"
                      value={option.value}
                    />
                    <span>
                      <span className="block font-black text-lg leading-7">{option.label}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-page-border bg-white px-5 font-bold text-page-ink/70 text-sm transition-colors enabled:hover:text-page-ink disabled:cursor-not-allowed disabled:opacity-45 ${focusClassName}`}
              disabled={isFirstQuestion}
              onClick={onPrevious}
              type="button"
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4" stroke={1.8} />
              이전
            </button>
            <button
              className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-page-ink px-6 font-black text-sm text-white transition-transform disabled:cursor-not-allowed disabled:opacity-45 ${focusClassName}`}
              disabled={!canGoNext}
              onClick={onNext}
              type="button"
            >
              {nextButtonLabel}
              <ArrowRight aria-hidden="true" className="h-4 w-4" stroke={1.8} />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function ResultView({
  answers,
  onEdit,
  onRestart,
  result,
  signUpPath,
}: {
  answers: Answers;
  onEdit: () => void;
  onRestart: () => void;
  result: (typeof coupleTypeResults)[CoupleTypeCode];
  signUpPath: ReturnType<typeof getLocalizedPath>;
}) {
  const codeLetters = result.code.split("") as AxisValue[];

  return (
    <section className="px-[max(1rem,env(safe-area-inset-left))] py-10 sm:py-16">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
        <div className="rounded-4xl bg-page-ink p-6 text-white shadow-[0_36px_120px_rgba(36,22,23,0.2)] sm:p-8 lg:sticky lg:top-24 lg:self-start">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 font-bold text-sm text-white/78">
            <Sparkles aria-hidden="true" className="h-4 w-4 text-page-accent" stroke={1.8} />
            커플 대화 유형 결과
          </p>
          <h1 className="mt-7 break-keep font-black text-4xl leading-tight sm:text-6xl">{result.title}</h1>
          <p className="mt-5 font-black text-2xl text-page-accent">{result.displayCode}</p>
          <p className="mt-5 text-white/70 leading-8">{result.summary}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-page-accent px-5 font-black text-sm text-white transition-transform ${focusClassName}`}
              onClick={onEdit}
              type="button"
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4" stroke={1.8} />
              응답 조정하기
            </button>
            <button
              className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/18 bg-white/8 px-5 font-black text-sm text-white transition-colors hover:bg-white/14 ${focusClassName}`}
              onClick={onRestart}
              type="button"
            >
              <Refresh aria-hidden="true" className="h-4 w-4" stroke={1.8} />
              다시 하기
            </button>
          </div>
        </div>

        <div className="grid gap-5">
          <section className="rounded-4xl border border-page-border bg-page-surface p-6 shadow-[0_24px_90px_rgba(36,22,23,0.08)] sm:p-8">
            <h2 className="font-black text-2xl">둘의 네 가지 리듬</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {axisOrder.map((axisKey, index) => {
                const letter = codeLetters[index];
                const axis = axisDefinitions[axisKey];
                const option = getAxisOption(axisKey, letter);

                return (
                  <article className="rounded-3xl bg-page-soft p-5" key={axisKey}>
                    <p className="font-bold text-page-accent text-sm">{axis.label}</p>
                    <h3 className="mt-3 font-black text-xl">{option.label}</h3>
                    <p className="mt-3 text-page-ink/62 text-sm leading-6">{option.body}</p>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="rounded-4xl border border-page-border bg-white p-6 shadow-[0_24px_90px_rgba(36,22,23,0.08)] sm:p-8">
            <h2 className="font-black text-2xl">잘 맞는 지점</h2>
            <ul className="mt-5 grid gap-3">
              {result.strengths.map((strength) => (
                <li className="flex gap-3 rounded-2xl bg-[#f4fbf7] px-4 py-3 text-page-ink/72 leading-7" key={strength}>
                  <MessageDots aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-page-success" stroke={1.8} />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="grid gap-5 lg:grid-cols-2">
            <article className="rounded-4xl bg-[#fff3f0] p-6 sm:p-8">
              <h2 className="font-black text-2xl">조심할 점</h2>
              <p className="mt-4 text-page-ink/70 leading-8">{result.watchOut}</p>
            </article>
            <article className="rounded-4xl bg-[#eef7ff] p-6 sm:p-8">
              <h2 className="font-black text-2xl">오늘의 대화 미션</h2>
              <p className="mt-4 text-page-ink/70 leading-8">{result.dateMission}</p>
            </article>
          </section>

          <section className="rounded-4xl bg-page-accent p-6 text-white shadow-[0_24px_90px_rgba(255,77,109,0.18)] sm:p-8">
            <h2 className="font-black text-2xl">대화 원문 없이도 더 깊게 볼 수 있어요</h2>
            <p className="mt-4 max-w-2xl text-white/74 leading-8">
              이 테스트는 브라우저 안에서만 계산돼요. 결타래 미리보기에서는 원문 직접 인용 없이 대화 패턴을 더 촘촘하게
              살펴보는 흐름을 준비하고 있어요.
            </p>
            <Link
              className={`mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-5 font-black text-page-accent text-sm transition ${focusClassName}`}
              href={signUpPath}
            >
              결타래 무료 미리보기
              <ArrowRight aria-hidden="true" className="h-4 w-4" stroke={1.8} />
            </Link>
          </section>

          <p className="text-page-ink/46 text-sm">
            응답 수 {Object.keys(answers).length}개 · 결과는 서버에 저장되지 않고 새로고침하면 초기화돼요.
          </p>
        </div>
      </div>
    </section>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-page-border bg-page-surface p-5 shadow-[0_18px_55px_rgba(36,22,23,0.07)]">
      <p className="font-bold text-page-ink/48 text-sm">{label}</p>
      <p className="mt-2 font-black text-2xl">{value}</p>
    </div>
  );
}

function calculateCoupleTypeCode(answers: Answers): CoupleTypeCode {
  const selected = axisOrder.map((axis) => resolveAxisValue(axis, answers)).join("");

  return selected as CoupleTypeCode;
}

function resolveAxisValue(axis: Axis, answers: Answers): AxisValue {
  const values = axisDefinitions[axis].values;

  const score = {
    [values[0]]: 0,
    [values[1]]: 0,
  } as Record<AxisValue, number>;

  for (const question of coupleTypeQuestions) {
    if (question.axis !== axis) {
      continue;
    }

    const answer = answers[question.id];

    if (answer) {
      score[answer] += 1;
    }
  }

  return score[values[0]] > score[values[1]] ? values[0] : values[1];
}

function getAxisOption(axis: Axis, value: AxisValue): AxisOption {
  const options = axisDefinitions[axis].options as Partial<Record<AxisValue, AxisOption>>;
  const option = options[value];

  if (!option) {
    throw new Error(`Invalid axis option: ${axis}:${value}`);
  }

  return option;
}
