import Link from "next/link";
import { Suspense } from "react";

import { getCurrentSession } from "@/feature/auth/session";
import { buildSettingsPath } from "@/feature/auth/shared";
import type { Locale } from "@/i18n/config";
import { getLocalizedPath } from "@/i18n/pathnames";

import {
  factCards,
  faqs,
  modes,
  pillars,
  pricingPlans,
  reportCards,
  sampleExcerpts,
  steps,
  trustItems,
} from "../_lib/landing-content";

type LandingPageProps = {
  locale: Locale;
};

const navItems = [
  { href: "#experience", label: "체험" },
  { href: "#pricing", label: "가격" },
  { href: "#faq", label: "FAQ" },
] as const;

const factRailGroups = [
  { id: "primary", isHidden: false },
  { id: "duplicate", isHidden: true },
] as const;

const heroBubbles = [
  "오늘은 좀 보고 싶었어",
  "그날 우리 왜 그렇게 웃었지?",
  "처음 말 놓은 날 기억나?",
  "내일은 내가 먼저 말 걸게",
] as const;

const focusClassName = "focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-page-accent";

const heroBubbleDelayClassNames = [
  "",
  "motion-safe:[animation-delay:0.5s]",
  "motion-safe:[animation-delay:1s]",
  "motion-safe:[animation-delay:1.5s]",
] as const;

const heroReportDelayClassNames = [
  "",
  "motion-safe:[animation-delay:0.35s]",
  "motion-safe:[animation-delay:0.7s]",
] as const;

export function LandingPage({ locale }: LandingPageProps) {
  const homePath = getLocalizedPath(locale, "/");
  const startPath = getLocalizedPath(locale, "/sign-up");
  const loginPath = getLocalizedPath(locale, "/login");

  return (
    <>
      <header className="sticky top-0 z-50 border-page-border/70 border-b bg-page-bg/88 px-[max(1rem,env(safe-area-inset-left))] backdrop-blur-2xl">
        <nav
          aria-label="주요 탐색"
          className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
        >
          <Link
            className={`group inline-flex touch-manipulation items-center gap-3 font-bold text-page-ink tracking-tight ${focusClassName}`}
            href={homePath}
          >
            <span className="grid h-9 w-9 place-items-center rounded-2xl bg-page-ink text-white shadow-[0_14px_40px_rgba(36,22,23,0.18)]">
              G
            </span>
            <span className="text-lg" translate="no">
              결타래
            </span>
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <a
                className={`touch-manipulation font-semibold text-page-ink/62 text-sm transition-colors hover:text-page-ink ${focusClassName}`}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </a>
            ))}
          </div>
          <Suspense fallback={<LandingHeaderGuestActions loginPath={loginPath} startPath={startPath} />}>
            <LandingHeaderActions locale={locale} loginPath={loginPath} startPath={startPath} />
          </Suspense>
        </nav>
      </header>

      <main className="overflow-x-hidden bg-page-bg text-page-ink" id="main-content">
        <HeroSection startPath={startPath} />
        <FactSection startPath={startPath} />
        <ValueSection />
        <ExperienceSection />
        <SampleSection />
        <HowItWorksSection />
        <ModeSection startPath={startPath} />
        <PricingSection startPath={startPath} />
        <TrustSection />
        <FaqSection />
        <FinalCta startPath={startPath} />
      </main>
    </>
  );
}

type LandingHeaderActionsProps = {
  locale: Locale;
  loginPath: ReturnType<typeof getLocalizedPath>;
  startPath: ReturnType<typeof getLocalizedPath>;
};

async function LandingHeaderActions({ locale, loginPath, startPath }: LandingHeaderActionsProps) {
  const session = await getCurrentSession();
  const myPagePath = session?.user.username ? getLocalizedPath(locale, buildSettingsPath(session.user.username)) : null;

  if (myPagePath) {
    return (
      <div className="flex items-center gap-3">
        <Link
          className={`inline-flex min-h-11 touch-manipulation items-center justify-center rounded-full bg-page-accent px-5 font-bold text-sm text-white shadow-[0_16px_40px_rgba(255,77,109,0.25)] transition-transform hover:-translate-y-0.5 ${focusClassName}`}
          href={myPagePath}
        >
          마이페이지
        </Link>
      </div>
    );
  }

  return <LandingHeaderGuestActions loginPath={loginPath} startPath={startPath} />;
}

function LandingHeaderGuestActions({
  loginPath,
  startPath,
}: Pick<LandingHeaderActionsProps, "loginPath" | "startPath">) {
  return (
    <div className="flex items-center gap-3">
      <Link
        className={`hidden touch-manipulation font-semibold text-page-ink/62 text-sm transition-colors hover:text-page-ink sm:inline-flex ${focusClassName}`}
        href={loginPath}
      >
        로그인
      </Link>
      <Link
        className={`inline-flex min-h-11 touch-manipulation items-center justify-center rounded-full bg-page-accent px-5 font-bold text-sm text-white shadow-[0_16px_40px_rgba(255,77,109,0.25)] transition-transform hover:-translate-y-0.5 ${focusClassName}`}
        href={startPath}
      >
        시작하기
      </Link>
    </div>
  );
}

function HeroSection({ startPath }: { startPath: ReturnType<typeof getLocalizedPath> }) {
  return (
    <section className="relative isolate min-h-[calc(100svh-4rem)] overflow-hidden bg-[#1a1a1a] px-[env(safe-area-inset-left)] text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(255,77,109,0.34),transparent_34%),radial-gradient(circle_at_78%_18%,rgba(255,215,180,0.18),transparent_28%),linear-gradient(135deg,#1a1a1a_0%,#251719_58%,#120f0e_100%)]" />
      <div className="absolute right-0 bottom-0 -z-10 h-72 w-72 rounded-full bg-page-accent/24 blur-3xl" />

      <div className="mx-auto grid min-h-[calc(100svh-4rem)] w-full max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
        <div className="max-w-2xl">
          <p className="font-semibold text-page-accent text-xs uppercase tracking-[0.32em]">
            Zero-Upload-Raw · Fact Bundle · Non-Clinical
          </p>
          <h1 className="mt-5 text-balance font-black text-5xl leading-[1.02] tracking-[-0.06em] sm:text-6xl lg:text-7xl">
            어제의 카톡에서,
            <br />
            내일의 대화법을 찾아드려요
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-lg text-white/72 leading-8 sm:text-xl">
            우리의 모든 대화를 AI가 분석해서 관계 패턴, 내 소통 습관, 앞으로의 힌트까지. 혼자 돌아보거나, 둘이 함께
            열어보거나.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              className={`inline-flex min-h-14 w-full flex-1 touch-manipulation items-center justify-center rounded-2xl bg-page-accent px-6 font-bold text-base text-white shadow-[0_24px_80px_rgba(255,77,109,0.34)] transition-transform hover:-translate-y-0.5 sm:w-90 ${focusClassName}`}
              href={startPath}
            >
              우리 카톡 분석하기 · 무료 미리보기
            </Link>
            <a
              className={`inline-flex min-h-14 touch-manipulation items-center justify-center rounded-2xl border border-white/18 bg-white/8 px-6 font-bold text-base text-white backdrop-blur transition-colors hover:bg-white/14 ${focusClassName}`}
              href="#sample"
            >
              샘플 먼저 보기
            </a>
          </div>
          <p className="mt-5 max-w-2xl text-sm text-white/62 leading-7">
            원본은 내 컴퓨터만 · AI 학습 0 · 개인정보 없는 데이터만 AI에게 · 6분이면 완성
          </p>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-lg">
      <div className="mx-auto overflow-hidden rounded-[2.4rem] border border-white/14 bg-white/10 p-5 shadow-[0_50px_140px_rgba(0,0,0,0.42)] backdrop-blur-2xl motion-safe:animate-hero-float">
        <div className="rounded-[1.8rem] bg-[#fdfaf6] p-4">
          <div className="mb-4 flex items-center justify-between border-page-border border-b pb-3 text-page-ink">
            <div>
              <p className="font-bold text-sm">우리의 연대기</p>
              <p className="text-page-ink/50 text-xs">대화가 리포트로 재조합되는 중</p>
            </div>
            <div className="h-3 w-3 rounded-full bg-page-accent" />
          </div>
          <div className="space-y-3">
            {heroBubbles.map((bubble, index) => (
              <div
                className={`max-w-[78%] rounded-3xl px-4 py-3 text-sm shadow-sm motion-safe:animate-bubble-rise ${heroBubbleDelayClassNames[index]} ${
                  index % 2 === 0 ? "bg-page-soft text-page-ink" : "ml-auto bg-page-ink text-white"
                }`}
                key={bubble}
              >
                {bubble}
              </div>
            ))}
          </div>
          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {reportCards.slice(0, 3).map((card, index) => (
              <div
                className={`rounded-3xl bg-white p-4 shadow-[0_18px_48px_rgba(36,22,23,0.12)] motion-safe:animate-report-settle ${heroReportDelayClassNames[index]}`}
                key={card.label}
              >
                <p className="font-semibold text-[0.68rem] text-page-accent uppercase tracking-[0.16em]">
                  {card.label}
                </p>
                <p className="mt-2 font-bold text-page-ink text-sm leading-5">{card.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FactSection({ startPath }: { startPath: ReturnType<typeof getLocalizedPath> }) {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-bold text-page-accent text-sm">알고 계셨나요?</p>
            <h2 className="mt-3 text-balance font-black text-3xl tracking-[-0.04em] sm:text-5xl">
              연구로 밝혀진 커플 대화의 비밀
            </h2>
          </div>
          <Link
            className={`inline-flex min-h-12 touch-manipulation items-center justify-center rounded-full bg-page-ink px-5 font-bold text-sm text-white transition-transform hover:-translate-y-0.5 ${focusClassName}`}
            href={startPath}
          >
            우리는 어떨까?
          </Link>
        </div>
      </div>

      <div className="mask-[linear-gradient(90deg,transparent,black_8%,black_92%,transparent)] mt-8 overflow-hidden">
        <ul
          aria-label="커플 대화 연구 카드"
          className="flex w-max list-none gap-4 px-4 motion-safe:animate-fact-marquee sm:px-6 lg:px-8 focus-within:[animation-play-state:paused] hover:[animation-play-state:paused]"
        >
          {factRailGroups
            .flatMap((group) => factCards.map((fact) => ({ fact, group })))
            .map(({ fact, group }) => (
              <li
                aria-hidden={group.isHidden}
                className="w-76 shrink-0 rounded-4xl border border-page-border bg-page-surface p-6 shadow-[0_20px_70px_rgba(36,22,23,0.08)] sm:w-92"
                key={`${group.id}-${fact.title}`}
              >
                <h3 className="text-balance font-black text-2xl tracking-[-0.04em]">{fact.title}</h3>
                <p className="mt-4 text-page-ink/68 text-sm leading-7">{fact.body}</p>
                <p className="mt-6 font-semibold text-page-ink/42 text-xs">{fact.source}</p>
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
}

function ValueSection() {
  return (
    <section className="px-[max(1rem,env(safe-area-inset-left))] py-16 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 rounded-[2.5rem] bg-page-ink px-6 py-10 text-white shadow-[0_40px_120px_rgba(36,22,23,0.18)] sm:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:p-14">
        <div>
          <p className="font-bold text-page-accent text-sm">핵심 가치</p>
          <h2 className="mt-4 text-balance font-black text-3xl tracking-[-0.04em] sm:text-5xl">
            거울 한 번이면 내일 카톡이 달라져요
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-4xl bg-white/8 p-6">
            <p className="font-bold text-sm text-white/48">Before</p>
            <p className="mt-3 font-bold text-xl leading-8">왜 자꾸 같은 대화에서 멈추는지 감으로만 짐작해요.</p>
          </div>
          <div className="rounded-4xl bg-page-accent p-6">
            <p className="font-bold text-sm text-white/72">After</p>
            <p className="mt-3 font-bold text-xl leading-8">
              답장 리듬, 표현 방식, 재연결 순간을 보고 다음 말을 고를 수 있어요.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ExperienceSection() {
  return (
    <section className="px-[max(1rem,env(safe-area-inset-left))] py-16 sm:py-24" id="experience">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionIntro eyebrow="6가지 체험" title="우리 관계 전체를 손에 쥐는 한 권의 앨범" />
        <div className="mt-10 grid gap-px overflow-hidden rounded-4xl border border-page-border bg-page-border md:grid-cols-2 lg:grid-cols-3">
          {pillars.map((pillar, index) => (
            <article className="min-h-64 bg-page-surface p-7 transition-colors hover:bg-white" key={pillar.title}>
              <p className="font-black text-page-accent/70 text-sm">0{index + 1}</p>
              <h3 className="mt-8 font-black text-2xl tracking-[-0.04em]">{pillar.title}</h3>
              <p className="mt-4 text-page-ink/66 text-sm leading-7">{pillar.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SampleSection() {
  return (
    <section className="px-[max(1rem,env(safe-area-inset-left))] py-16 sm:py-24" id="sample">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionIntro eyebrow="샘플 프리뷰" title="직접 인용 없이도 충분히 우리답게 읽혀요" />
        <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative min-h-128 overflow-hidden rounded-[2.4rem] bg-[#241617] p-6 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,77,109,0.28),transparent_30%),radial-gradient(circle_at_80%_70%,rgba(255,236,210,0.14),transparent_30%)]" />
            <div className="relative grid gap-4">
              {reportCards.map((card, index) => (
                <article
                  className={`rounded-[1.7rem] border border-white/12 bg-white/10 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.18)] backdrop-blur ${
                    index > 2 ? "blur-[1px]" : ""
                  }`}
                  key={card.label}
                >
                  <p className="font-bold text-page-accent text-xs">{card.label}</p>
                  <p className="mt-2 font-black text-xl tracking-[-0.04em]">{card.value}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="grid gap-4">
            {sampleExcerpts.map((excerpt, index) => (
              <blockquote
                className="rounded-4xl border border-page-border bg-page-surface p-7 shadow-[0_20px_70px_rgba(36,22,23,0.07)]"
                key={excerpt}
              >
                <p className="font-black text-page-accent text-sm">Sample 0{index + 1}</p>
                <p className="mt-4 text-pretty font-bold text-xl leading-9 tracking-[-0.03em]">{excerpt}</p>
              </blockquote>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section className="px-[max(1rem,env(safe-area-inset-left))] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionIntro eyebrow="How It Works" title="원문보다 안전한 분석 흐름을 먼저 설계했어요" />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {steps.map((step, index) => (
            <article className="rounded-4xl bg-page-soft p-7" key={step.title}>
              <p className="font-black text-5xl text-page-accent/28 tracking-[-0.08em]">0{index + 1}</p>
              <h3 className="mt-8 font-black text-2xl tracking-[-0.04em]">{step.title}</h3>
              <p className="mt-4 text-page-ink/66 text-sm leading-7">{step.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ModeSection({ startPath }: { startPath: ReturnType<typeof getLocalizedPath> }) {
  return (
    <section className="px-[max(1rem,env(safe-area-inset-left))] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionIntro eyebrow="이용 모드" title="혼자 돌아보거나, 둘이 함께 열어보거나" />
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {modes.map((mode) => (
            <article
              className="group rounded-[2.3rem] border border-page-border bg-page-surface p-8 shadow-[0_24px_90px_rgba(36,22,23,0.07)] transition-transform hover:-translate-y-1"
              key={mode.label}
            >
              <p className="font-black text-page-accent text-sm uppercase tracking-[0.28em]">{mode.label}</p>
              <h3 className="mt-8 font-black text-4xl tracking-[-0.05em]">{mode.title}</h3>
              <p className="mt-5 max-w-xl text-page-ink/66 leading-7">{mode.body}</p>
              <Link
                className={`mt-8 inline-flex min-h-12 touch-manipulation items-center justify-center rounded-full bg-page-ink px-5 font-bold text-sm text-white transition-transform group-hover:translate-x-1 ${focusClassName}`}
                href={startPath}
              >
                이 모드로 시작하기
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection({ startPath }: { startPath: ReturnType<typeof getLocalizedPath> }) {
  return (
    <section className="px-[max(1rem,env(safe-area-inset-left))] py-16 sm:py-24" id="pricing">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionIntro eyebrow="Pricing" title="먼저 미리보고, 필요할 때 전체 리포트를 열어요" />
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {pricingPlans.map((plan, index) => (
            <article
              className={`rounded-[2.3rem] p-8 ${
                index === 0
                  ? "border border-page-border bg-page-surface"
                  : "bg-page-ink text-white shadow-[0_32px_110px_rgba(36,22,23,0.18)]"
              }`}
              key={plan.name}
            >
              <p className="font-black text-page-accent text-sm uppercase tracking-[0.28em]">{plan.name}</p>
              <p className="mt-7 font-black text-5xl tracking-[-0.06em]">{plan.price}</p>
              <p className={`mt-5 leading-7 ${index === 0 ? "text-page-ink/66" : "text-white/68"}`}>{plan.body}</p>
              <Link
                className={`mt-8 inline-flex min-h-12 touch-manipulation items-center justify-center rounded-full px-5 font-bold text-sm transition-transform hover:-translate-y-0.5 ${focusClassName} ${
                  index === 0 ? "bg-page-ink text-white" : "bg-page-accent text-white"
                }`}
                href={startPath}
              >
                무료 미리보기 시작
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustSection() {
  return (
    <section className="px-[max(1rem,env(safe-area-inset-left))] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 rounded-[2.5rem] border border-page-border bg-page-surface p-8 shadow-[0_24px_90px_rgba(36,22,23,0.07)] lg:grid-cols-[0.75fr_1.25fr] lg:p-12">
          <div>
            <p className="font-bold text-page-accent text-sm">Trust Stack</p>
            <h2 className="mt-4 text-balance font-black text-4xl tracking-[-0.05em]">신뢰가 곧 제품이에요</h2>
          </div>
          <ul className="grid gap-3">
            {trustItems.map((item) => (
              <li className="rounded-2xl bg-page-soft px-5 py-4 text-page-ink/72 leading-7" key={item}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section className="px-[max(1rem,env(safe-area-inset-left))] py-16 sm:py-24" id="faq">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionIntro eyebrow="FAQ" title="결정하기 전에 가장 먼저 확인할 것들" />
        <div className="mt-10 divide-y divide-page-border overflow-hidden rounded-4xl border border-page-border bg-page-surface">
          {faqs.map((faq) => (
            <details className="group p-6 [&>summary::-webkit-details-marker]:hidden" key={faq.question}>
              <summary
                className={`flex cursor-pointer touch-manipulation list-none items-center justify-between gap-6 font-bold text-lg ${focusClassName}`}
              >
                <span>{faq.question}</span>
                <span aria-hidden="true" className="text-page-accent transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 text-page-ink/66 leading-7">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta({ startPath }: { startPath: ReturnType<typeof getLocalizedPath> }) {
  return (
    <section className="px-[max(1rem,env(safe-area-inset-left))] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl rounded-[2.7rem] bg-page-accent px-6 py-14 text-center text-white shadow-[0_40px_120px_rgba(255,77,109,0.22)] sm:px-10">
        <p className="font-bold text-sm text-white/70">무료 미리보기</p>
        <h2 className="mx-auto mt-4 max-w-3xl text-balance font-black text-4xl tracking-[-0.05em] sm:text-6xl">
          오늘의 대화를 내일의 힌트로 바꿔보세요
        </h2>
        <Link
          className={`mt-9 inline-flex min-h-14 touch-manipulation items-center justify-center rounded-2xl bg-white px-7 font-black text-base text-page-accent transition-transform hover:-translate-y-0.5 ${focusClassName}`}
          href={startPath}
        >
          우리 카톡 분석하기 · 무료 미리보기
        </Link>
      </div>
      <footer className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 text-page-ink/52 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>
          <span translate="no">결타래</span> · 우리의 연대기
        </p>
        <p>비임상 관계 리포트 · 원문 직접 인용 없음 · 로컬 우선 원칙</p>
      </footer>
    </section>
  );
}

function SectionIntro({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="max-w-3xl">
      <p className="font-bold text-page-accent text-sm">{eyebrow}</p>
      <h2 className="mt-3 text-balance font-black text-3xl tracking-[-0.04em] sm:text-5xl">{title}</h2>
    </div>
  );
}
