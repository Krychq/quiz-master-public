import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { KeyRound } from "lucide-react";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password – QuizMaster",
  description: "Set a new password for your QuizMaster account.",
};

export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/?error=reset-link-expired");
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <KeyRound className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Set New Password
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Choose a strong password for{" "}
            <span className="font-medium text-foreground">{user.email}</span>
          </p>
        </div>

        {/* Form card */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <ResetPasswordForm />
        </div>
      </div>
    </div>
  );
}
