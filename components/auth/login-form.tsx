"use client";

import { useActionState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { login } from "@/app/actions/auth";
import { loginSchema, type LoginSchema } from "@/lib/schemas/auth";
import type { ActionState } from "@/types";

interface LoginFormProps {
  onSuccess: () => void;
  onForgotPassword: () => void;
}

export function LoginForm({ onSuccess, onForgotPassword }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(login, null);
  const [, startTransition] = useTransition();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (state?.success) onSuccess();
  }, [state, onSuccess]);

  const onSubmit = (data: LoginSchema) => {
    const formData = new FormData();
    formData.set("email", data.email);
    formData.set("password", data.password);
    startTransition(() => formAction(formData));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="login-email">Email</Label>
        <Input id="login-email" type="email" {...register("email")} />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="login-password">Password</Label>
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm font-medium text-primary hover:underline"
          >
            Forgot password?
          </button>
        </div>
        <Input id="login-password" type="password" {...register("password")} />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Login
      </Button>
    </form>
  );
}
