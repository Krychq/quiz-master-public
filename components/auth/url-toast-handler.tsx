"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

const AUTH_ERROR_MESSAGES: Record<
  string,
  { title: string; description: string }
> = {
  otp_expired: {
    title: "Link Expired",
    description:
      "Your password reset link has expired. Please request a new one.",
  },
  access_denied: {
    title: "Access Denied",
    description: "This link is no longer valid. Please request a new one.",
  },
  "auth-code-error": {
    title: "Invalid Link",
    description: "This link is invalid or has already been used.",
  },
};

const FALLBACK = {
  title: "Authentication Error",
  description: "Something went wrong. Please try again.",
};

export function UrlToastHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const authError = searchParams.get("auth_error");
    if (!authError) return;

    const { title, description } = AUTH_ERROR_MESSAGES[authError] ?? FALLBACK;
    toast.error(title, { description });

    const params = new URLSearchParams(searchParams.toString());
    params.delete("auth_error");
    const clean = params.size > 0 ? `${pathname}?${params}` : pathname;
    router.replace(clean, { scroll: false });
  }, [searchParams, router, pathname]);

  return null;
}
