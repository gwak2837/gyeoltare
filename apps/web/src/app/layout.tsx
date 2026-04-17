import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: "gyeoltare",
  description: "Next.js web shell with a Hono API boundary and Drizzle-backed read models.",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
