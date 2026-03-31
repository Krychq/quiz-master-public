"use client";

import { useActionState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, RotateCcwKey } from "lucide-react";
import { resetPassword } from "@/app/actions/auth";
import { forgotPasswordSchema, type ForgotPasswordSchema } from "@/lib/schemas/auth";
import type { ActionState } from "@/types";

interface ForgotPasswordFormProps {
  onBack: () => void;
  onSuccess: (message: string) => void;
}

export function ForgotPasswordForm({ onBack, onSuccess }: ForgotPasswordFormProps) {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(resetPassword, null);
  const [, startTransition] = useTransition();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  useEffect(() => {
    if (state?.success && state.data) onSuccess(state.data);
  }, [state, onSuccess]);

  const onSubmit = (data: ForgotPasswordSchema) => {
    const formData = new FormData();
    formData.set("email", data.email);
    startTransition(() => formAction(formData));
  };

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2 text-center pb-2">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <RotateCcwKey className="h-8 w-8 text-primary" />
        </div>
        <h3 className="font-medium tracking-tight">Reset Password</h3>
        <p className="text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="reset-email">Email</Label>
          <Input id="reset-email" type="email" {...register("email")} />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

        <div className="flex flex-col space-y-2 pt-2">
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Reset Link
          </Button>
          <Button type="button" variant="ghost" onClick={onBack} className="w-full">
            Back to Login
          </Button>
        </div>
      </form>
    </div>
  );
}
