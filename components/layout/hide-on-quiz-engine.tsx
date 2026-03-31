"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export function HideOnQuizEngine({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const isQuizEngine =
    pathname?.startsWith("/quiz/") && pathname?.split("/").length === 3;

  if (isQuizEngine) {
    return null;
  }

  return <>{children}</>;
}
