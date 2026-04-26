import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { isLocale } from "@/i18n/config";
import { getLocalizedPath } from "@/i18n/pathnames";

export default async function AuthLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const t = await getTranslations({
    locale,
    namespace: "auth",
  });

  const workflowSteps = [
    {
      body: t("layout.workflowUploadBody"),
      icon: <ChatIcon />,
      title: t("layout.workflowUploadTitle"),
    },
    {
      body: t("layout.workflowProcessBody"),
      icon: <LockIcon />,
      title: t("layout.workflowProcessTitle"),
    },
    {
      body: t("layout.workflowReportBody"),
      icon: <ReportIcon />,
      title: t("layout.workflowReportTitle"),
    },
  ] as const;

  const trustItems = [
    {
      icon: <ShieldIcon />,
      body: t("layout.trustEncryptionBody"),
      title: t("layout.trustEncryptionTitle"),
    },
    {
      icon: <LockIcon />,
      body: t("layout.trustPrivateBody"),
      title: t("layout.trustPrivateTitle"),
    },
    {
      icon: <DocumentShieldIcon />,
      body: t("layout.trustOwnershipBody"),
      title: t("layout.trustOwnershipTitle"),
    },
  ] as const;

  return (
    <main className="mx-auto flex h-full w-full max-w-screen-2xl flex-1 items-center justify-center text-page-ink xl:grid xl:grid-cols-[2fr_1fr]">
      <section className="hidden px-6 py-10 sm:px-10 xl:block xl:border-[#e9dfd7] xl:border-r xl:py-10 2xl:px-15">
        <Link
          aria-label={t("layout.homeAria")}
          className="inline-flex touch-manipulation items-center gap-2 rounded-xl transition focus-visible:outline-3 focus-visible:outline-page-accent focus-visible:outline-offset-3"
          href={getLocalizedPath(locale, "/")}
        >
          <KnotMark />
          <span className="font-black text-[1.72rem] tracking-[-0.055em]" translate="no">
            결타래
          </span>
        </Link>

        <div className="mt-8">
          <p className="font-black text-[#ff4d54] text-base">{t("layout.eyebrow")}</p>
          <h1 className="mt-5 max-w-124 whitespace-pre-line break-keep font-black text-[2.55rem] leading-[1.2] tracking-[-0.045em] sm:text-[2.75rem]">
            {t("layout.title")}
          </h1>
          <p className="mt-6 max-w-136 whitespace-pre-line break-keep text-[#6e6862] leading-8">
            {t("layout.description")}
          </p>
        </div>

        <section
          aria-label={t("layout.workflowTitle")}
          className="mt-4 overflow-hidden rounded-2xl border border-[#eadbd0] bg-white/62 shadow-[0_18px_60px_rgba(64,44,34,0.04)]"
        >
          <div className="border-[#eadbd0] border-b px-7 py-[1.05rem]">
            <h2 className="font-black text-[0.95rem]">{t("layout.workflowTitle")}</h2>
          </div>

          <ol className="grid list-none divide-y divide-[#eadbd0] sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-stretch sm:divide-y-0">
            {workflowSteps.map((step, index) => (
              <WorkflowStep index={index} key={step.title} step={step} />
            ))}
          </ol>

          <div className="grid divide-y divide-[#eadbd0] border-[#eadbd0] border-t lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:divide-x lg:divide-y-0">
            <div className="px-4 py-4">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-[0.8rem]">{t("layout.previewChatTitle")}</h3>
                <span className="text-[#8d8780] text-xs">{t("layout.previewDate")}</span>
              </div>
              <div className="mt-5 space-y-3.5">
                <div className="flex items-start gap-2">
                  <AvatarMini />
                  <div className="flex items-end gap-2">
                    <p className="max-w-[9.8rem] rounded-xl bg-[#f7eee6] px-3.5 py-2.5 text-[#514a45] text-[0.78rem] leading-5">
                      {t("layout.previewChatOne")}
                    </p>
                    <span className="pb-1 text-[#aaa29a] text-[0.65rem]">{t("layout.previewChatOneTime")}</span>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="flex items-end gap-2">
                    <span className="pb-1 text-[#aaa29a] text-[0.65rem]">{t("layout.previewChatTwoTime")}</span>
                    <p className="max-w-44 rounded-xl bg-[#f1e7df] px-3.5 py-2.5 text-[#514a45] text-[0.78rem] leading-5">
                      {t("layout.previewChatTwo")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <AvatarMini />
                  <div className="flex items-end gap-2">
                    <p className="max-w-[9.8rem] rounded-xl bg-[#f7eee6] px-3.5 py-2.5 text-[#514a45] text-[0.78rem] leading-5">
                      {t("layout.previewChatThree")}
                    </p>
                    <span className="pb-1 text-[#aaa29a] text-[0.65rem]">{t("layout.previewChatThreeTime")}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-4 py-4">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-[0.8rem]">{t("layout.previewReportTitle")}</h3>
                <span className="font-bold text-[#746b64] text-xs">{t("layout.previewReportAction")} ›</span>
              </div>
              <div className="mt-4 rounded-2xl border border-[#eadbd0] bg-white/70 px-4 py-3">
                <p className="font-black text-[#5b534e] text-xs">{t("layout.previewGraphLabel")}</p>
                <MiniReportChart
                  hardLabel={t("layout.previewGraphHard")}
                  normalLabel={t("layout.previewGraphNormal")}
                  goodLabel={t("layout.previewGraphGood")}
                />
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <PreviewList
                  title={t("layout.previewIssueTitle")}
                  variant="dot"
                  values={[t("layout.previewIssueOne"), t("layout.previewIssueTwo"), t("layout.previewIssueThree")]}
                />
                <PreviewList
                  title={t("layout.previewSuggestionTitle")}
                  variant="check"
                  values={[
                    t("layout.previewSuggestionOne"),
                    t("layout.previewSuggestionTwo"),
                    t("layout.previewSuggestionThree"),
                  ]}
                />
              </div>
            </div>
          </div>
        </section>

        <section
          aria-label={t("layout.trustTitle")}
          className="mt-8 grid overflow-hidden rounded-xl border border-[#eadbd0] bg-white/55 sm:grid-cols-3"
        >
          {trustItems.map((item) => (
            <article
              className="flex gap-3 border-[#eadbd0] border-b p-5 last:border-b-0 sm:border-r sm:border-b-0 sm:last:border-r-0"
              key={item.title}
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center text-page-ink">{item.icon}</span>
              <div>
                <h2 className="break-keep font-black text-[0.9rem]">{item.title}</h2>
                <p className="mt-1 break-keep text-[#6d665f] text-xs leading-5">{item.body}</p>
              </div>
            </article>
          ))}
        </section>

        <p className="mt-7 text-[#9a928c] text-sm">{t("layout.footer")}</p>
      </section>

      <section className="w-full max-w-lg flex-1 justify-center px-4 py-10 sm:px-10 xl:pt-30 2xl:px-15">
        {children}
      </section>
    </main>
  );
}

function WorkflowStep({
  index,
  step,
}: {
  index: number;
  step: {
    body: string;
    icon: ReactNode;
    title: string;
  };
}) {
  return (
    <>
      {index > 0 ? (
        <li aria-hidden="true" className="hidden items-center justify-center px-1 text-[#a89f97] sm:flex">
          <ArrowIcon />
        </li>
      ) : null}
      <li className="flex items-center gap-4 px-5 py-2">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#eadbd0] bg-white text-[#ff665f]">
          {step.icon}
        </span>
        <span>
          <span className="block break-keep font-black text-[0.8rem]">{step.title}</span>
          <span className="mt-1 block break-keep text-[#6d665f] text-xs">{step.body}</span>
        </span>
      </li>
    </>
  );
}

function MiniReportChart({
  goodLabel,
  hardLabel,
  normalLabel,
}: {
  goodLabel: string;
  hardLabel: string;
  normalLabel: string;
}) {
  return (
    <div className="mt-3 grid w-full grid-cols-[minmax(0,1fr)_2.4rem] items-stretch gap-2">
      <svg aria-hidden="true" className="aspect-5/1 w-full" fill="none" viewBox="0 0 260 52">
        <path d="M2 8H258" stroke="rgba(36,22,23,0.07)" />
        <path d="M2 26H258" stroke="rgba(36,22,23,0.07)" />
        <path d="M2 44H258" stroke="rgba(36,22,23,0.07)" />
        <path d="M86 8V44" stroke="rgba(36,22,23,0.055)" />
        <path d="M172 8V44" stroke="rgba(36,22,23,0.055)" />
        <path d="M258 8V44" stroke="rgba(36,22,23,0.055)" />
        <path
          d="M2 35C10 17 19 3 31 7C43 11 37 27 54 27C70 27 72 16 87 18C104 20 105 40 124 42C143 44 148 25 165 26C181 27 180 37 197 34C215 31 218 49 234 47C246 45 248 33 258 26"
          stroke="#ff7b73"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <circle cx="197" cy="34" fill="#ff6b63" r="3.4" />
      </svg>
      <div aria-hidden="true" className="grid h-full grid-rows-3 break-keep text-[#827972] text-[0.65rem] leading-none">
        <span className="self-start">{goodLabel}</span>
        <span className="self-center">{normalLabel}</span>
        <span className="self-end">{hardLabel}</span>
      </div>
    </div>
  );
}

function PreviewList({
  title,
  values,
  variant,
}: {
  title: string;
  values: readonly [string, string, string];
  variant: "check" | "dot";
}) {
  return (
    <div className="rounded-[0.8rem] border border-[#eadbd0] bg-white/70 p-3.5">
      <h3 className="break-keep font-black text-[#5b534e] text-xs">{title}</h3>
      <ul className="mt-2 space-y-1 break-keep text-[#5d554f] text-xs leading-5">
        {values.map((value) => (
          <li className="flex gap-2" key={value}>
            {variant === "check" ? (
              <span
                aria-hidden="true"
                className="mt-1 grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full bg-[#ffe0dc] text-[#ff6b63]"
              >
                <CheckMiniIcon />
              </span>
            ) : (
              <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#4b423d]" />
            )}
            <span>{value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CheckMiniIcon() {
  return (
    <svg aria-hidden="true" className="h-2.5 w-2.5" fill="none" viewBox="0 0 10 10">
      <path
        d="m2.2 5 1.8 1.7 3.7-4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function KnotMark() {
  return (
    <svg aria-hidden="true" className="-ml-2 h-[2.65rem] w-[2.65rem]" fill="none" viewBox="0 0 42 42">
      <g stroke="#ff5252" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.95">
        <path d="M21 4.6c6.4 0 9.6 6.9 6.3 12.2-3.5 5.6-12.2 5-14.5-.9-2.2-5.8 4.2-11.9 10-8.6 6.4 3.7 4.9 13.9-2.3 15.4-7.5 1.6-13.4-6.2-9.8-12.7" />
        <path d="M32.8 9.1c4.7 4.7 3.2 12.4-2.7 14.9-6.4 2.7-13.1-3-11.6-9.5 1.4-6.1 9.9-7.4 13.1-2 3.7 6.3-2 14-9.2 12.5-7.5-1.6-10.2-11.3-4.5-16.2" />
        <path d="M36.9 20.9c0 6.4-6.9 9.6-12.2 6.3-5.6-3.5-5-12.2.9-14.5 5.8-2.2 11.9 4.2 8.6 10-3.7 6.4-13.9 4.9-15.4-2.3-1.6-7.5 6.2-13.4 12.7-9.8" />
        <path d="M32.9 32.8c-4.7 4.7-12.4 3.2-14.9-2.7-2.7-6.4 3-13.1 9.5-11.6 6.1 1.4 7.4 9.9 2 13.1-6.3 3.7-14-2-12.5-9.2 1.6-7.5 11.3-10.2 16.2-4.5" />
        <path d="M21 37.4c-6.4 0-9.6-6.9-6.3-12.2 3.5-5.6 12.2-5 14.5.9 2.2 5.8-4.2 11.9-10 8.6-6.4-3.7-4.9-13.9 2.3-15.4 7.5-1.6 13.4 6.2 9.8 12.7" />
        <path d="M9.2 32.9C4.5 28.2 6 20.5 11.9 18c6.4-2.7 13.1 3 11.6 9.5-1.4 6.1-9.9 7.4-13.1 2-3.7-6.3 2-14 9.2-12.5 7.5 1.6 10.2 11.3 4.5 16.2" />
        <path d="M5.1 21.1c0-6.4 6.9-9.6 12.2-6.3 5.6 3.5 5 12.2-.9 14.5-5.8 2.2-11.9-4.2-8.6-10 3.7-6.4 13.9-4.9 15.4 2.3 1.6 7.5-6.2 13.4-12.7 9.8" />
        <path d="M9.1 9.2c4.7-4.7 12.4-3.2 14.9 2.7 2.7 6.4-3 13.1-9.5 11.6-6.1-1.4-7.4-9.9-2-13.1 6.3-3.7 14 2 12.5 9.2-1.6 7.5-11.3 10.2-16.2 4.5" />
      </g>
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 20 20">
      <path
        d="M4.2 5.3h11.6v7.2H9.2l-3.7 2.8v-2.8H4.2V5.3Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
      <path d="M7.3 8.9h.01M10 8.9h.01M12.7 8.9h.01" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
      <path d="M7.5 10V8.1a4.5 4.5 0 0 1 9 0V10" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <rect height="9.2" rx="2" stroke="currentColor" strokeWidth="1.8" width="13.6" x="5.2" y="9.5" />
    </svg>
  );
}

function ReportIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 20 20">
      <path d="M5.2 3.4h6.9l2.7 2.8v10.4H5.2V3.4Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.6" />
      <path d="M12 3.6v3h2.8M7.6 9.3h4.8M7.6 12.1h4.8" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg aria-hidden="true" className="h-9 w-9" fill="none" viewBox="0 0 36 36">
      <path
        d="M18 4.6 28.2 8v8.1c0 6.8-4.5 12.4-10.2 14.9C12.3 28.5 7.8 22.9 7.8 16.1V8L18 4.6Z"
        stroke="currentColor"
        strokeWidth="1.9"
      />
      <path
        d="m13.8 17.7 2.7 2.7 5.8-6.1"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.9"
      />
    </svg>
  );
}

function DocumentShieldIcon() {
  return (
    <svg aria-hidden="true" className="h-9 w-9" fill="none" viewBox="0 0 36 36">
      <path d="M9 5.8h13.2l4.8 4.9v19.5H9V5.8Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.9" />
      <path d="M22 6v5h5M13.5 15.4h7M13.5 19.3h5.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <path
        d="M24.6 21.1 30 22.9v3.2c0 3.1-2.1 5.5-5.4 6.8-3.3-1.3-5.4-3.7-5.4-6.8v-3.2l5.4-1.8Z"
        fill="#fffdf9"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="m22.2 26.6 1.5 1.5 3.2-3.3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 20 20">
      <path
        d="M4 10h11.5m-4-4 4 4-4 4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function AvatarMini() {
  return (
    <svg aria-hidden="true" className="mt-1 h-6 w-6 shrink-0 rounded-full" fill="none" viewBox="0 0 24 24">
      <rect fill="#f5b6a5" height="24" rx="12" width="24" />
      <path
        d="M6.4 10.4c.2-4 2.6-6.5 6.1-6.5 3 0 5.1 2 5.5 5.4.3 2.3-.6 4.4-1.9 5.7H8c-1.1-1.1-1.7-2.7-1.6-4.6Z"
        fill="#3a2928"
      />
      <circle cx="12.1" cy="11.1" fill="#f4c7aa" r="4.3" />
      <path
        d="M8.6 10.2c3.4-.4 5.3-1.6 6.1-3.4 1.3 1 2 2.2 2.2 3.8"
        stroke="#3a2928"
        strokeLinecap="round"
        strokeWidth="1.2"
      />
      <path d="M6.1 22c1.2-3.4 3.1-5.1 5.9-5.1 2.9 0 4.9 1.7 6 5.1" fill="#fff3ea" />
      <path d="M9.5 12.4h.01M14.4 12.4h.01" stroke="#3a2928" strokeLinecap="round" strokeWidth="1.4" />
      <path d="M10.5 14.9c.9.6 2.1.6 3 0" stroke="#9b5f50" strokeLinecap="round" strokeWidth="1.1" />
    </svg>
  );
}
