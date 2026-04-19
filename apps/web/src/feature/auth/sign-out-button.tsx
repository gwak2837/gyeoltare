"use client";

import { authClient } from "@gyeoltare/auth/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Locale } from "@/i18n/config";
import { getLocalizedPath } from "@/i18n/pathnames";

type SignOutButtonProps = {
  className?: string;
  idleLabel: string;
  locale: Locale;
  pendingLabel?: string;
};

export function SignOutButton({ className, idleLabel, locale, pendingLabel }: SignOutButtonProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleClick() {
    setIsPending(true);

    try {
      await authClient.signOut();
      router.push(getLocalizedPath(locale, "/"));
      router.refresh();
    } finally {
      setIsPending(false);
    }
  }

  return (
    <button className={className} disabled={isPending} onClick={handleClick} type="button">
      {isPending ? (pendingLabel ?? idleLabel) : idleLabel}
    </button>
  );
}
