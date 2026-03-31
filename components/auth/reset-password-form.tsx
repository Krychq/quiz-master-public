"use client";

import { useActionState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2 } from "lucide-react";
import { updatePassword } from "@/app/actions/auth";
import { newPasswordSchema, type NewPasswordSchema } from "@/lib/schemas/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { ActionState } from "@/types";

export function ResetPasswordForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(updatePassword, null);
  const [, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewPasswordSchema>({
    resolver: zodResolver(newPasswordSchema),
  });

  useEffect(() => {
    if (state?.success) {
      toast.success("Password updated!", { description: state.data });
      router.push("/profile");
    }
  }, [state, router]);

  const onSubmit = (data: NewPasswordSchema) => {
    const formData = new FormData();
    formData.set("password", data.password);
    formData.set("confirmPassword", data.confirmPassword);
    startTransition(() => formAction(formData));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="new-password">New Password</Label>
        <Input
          id="new-password"
          type="password"
          placeholder="At least 8 characters"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm Password</Label>
        <Input
          id="confirm-password"
          type="password"
          placeholder="Repeat your new password"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
        )}
      </div>

      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <CheckCircle2 className="mr-2 h-4 w-4" />
        )}
        Set New Password
      </Button>
    </form>
  );
}
