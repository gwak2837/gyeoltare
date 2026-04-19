import type { ComponentPropsWithoutRef, ReactNode } from "react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function AuthCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={cn(
        "rounded-4xl border border-page-border/80 bg-page-surface/95 p-6 shadow-[0_30px_90px_rgba(45,36,74,0.14)] backdrop-blur sm:p-8",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function AuthHeading({ description, eyebrow, title }: { description: string; eyebrow?: string; title: string }) {
  return (
    <div>
      {eyebrow ? <p className="font-semibold text-page-accent text-xs uppercase tracking-[0.32em]">{eyebrow}</p> : null}
      <h1 className="mt-3 font-semibold text-3xl text-page-ink tracking-tight sm:text-[2rem]">{title}</h1>
      <p className="mt-3 text-page-ink/70 text-sm leading-6 sm:text-base">{description}</p>
    </div>
  );
}

export function AuthField({ children, hint, label }: { children: ReactNode; hint?: string; label: string }) {
  return (
    <div className="block">
      <span className="mb-2 block font-medium text-page-ink text-sm">{label}</span>
      {children}
      {hint ? <span className="mt-2 block text-page-ink/55 text-xs leading-5">{hint}</span> : null}
    </div>
  );
}

export function AuthInput({ className, ...props }: ComponentPropsWithoutRef<"input">) {
  return (
    <input
      className={cn(
        "w-full rounded-2xl border border-page-border bg-page-soft px-4 py-3 text-page-ink outline-none transition placeholder:text-page-ink/35 focus:border-page-accent/70 focus:bg-white focus:ring-4 focus:ring-page-accent/10",
        className,
      )}
      {...props}
    />
  );
}

export function AuthTextarea({ className, ...props }: ComponentPropsWithoutRef<"textarea">) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full rounded-2xl border border-page-border bg-page-soft px-4 py-3 text-page-ink outline-none transition placeholder:text-page-ink/35 focus:border-page-accent/70 focus:bg-white focus:ring-4 focus:ring-page-accent/10",
        className,
      )}
      {...props}
    />
  );
}

export function PrimaryButton({ className, ...props }: ComponentPropsWithoutRef<"button">) {
  return (
    <button
      className={cn(
        "inline-flex w-full items-center justify-center rounded-full bg-page-ink px-5 py-3 font-semibold text-sm text-white transition hover:-translate-y-0.5 hover:bg-page-ink/92 disabled:cursor-not-allowed disabled:opacity-55",
        className,
      )}
      {...props}
    />
  );
}

export function SecondaryButton({ className, ...props }: ComponentPropsWithoutRef<"button">) {
  return (
    <button
      className={cn(
        "inline-flex w-full items-center justify-center rounded-full border border-page-border bg-white px-5 py-3 font-semibold text-page-ink text-sm transition hover:-translate-y-0.5 hover:border-page-accent/40 hover:bg-page-soft disabled:cursor-not-allowed disabled:opacity-55",
        className,
      )}
      {...props}
    />
  );
}

export function InlineNotice({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "danger" | "neutral" | "success";
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border px-4 py-3 text-sm leading-6",
        tone === "danger" && "border-page-danger/20 bg-page-danger/8 text-page-danger",
        tone === "neutral" && "border-page-border bg-page-soft text-page-ink/72",
        tone === "success" && "border-page-success/20 bg-page-success/10 text-page-success",
      )}
    >
      {children}
    </div>
  );
}

export function SectionShell({
  children,
  description,
  title,
}: {
  children: ReactNode;
  description: string;
  title: string;
}) {
  return (
    <section className="rounded-[1.75rem] border border-page-border/80 bg-page-surface p-5 shadow-[0_18px_60px_rgba(45,36,74,0.08)] sm:p-6">
      <div className="mb-5">
        <h2 className="font-semibold text-page-ink text-xl tracking-tight">{title}</h2>
        <p className="mt-2 text-page-ink/68 text-sm leading-6">{description}</p>
      </div>
      {children}
    </section>
  );
}

export function StatusPill({ tone = "neutral", value }: { tone?: "neutral" | "success"; value: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 font-semibold text-[11px] uppercase tracking-[0.18em]",
        tone === "neutral" && "bg-page-soft text-page-ink/62",
        tone === "success" && "bg-page-success/12 text-page-success",
      )}
    >
      {value}
    </span>
  );
}
