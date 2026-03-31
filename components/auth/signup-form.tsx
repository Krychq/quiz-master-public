"use client";

import { useActionState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { signup } from "@/app/actions/auth";
import { signupSchema, type SignupSchema } from "@/lib/schemas/auth";
import type { ActionState } from "@/types";

interface SignupFormProps {
  onSuccess: (message?: string) => void;
}

export function SignupForm({ onSuccess }: SignupFormProps) {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(signup, null);
  const [, startTransition] = useTransition();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
  });

  useEffect(() => {
    if (state?.success) onSuccess(state.data);
  }, [state, onSuccess]);

  const onSubmit = (data: SignupSchema) => {
    const formData = new FormData();
    formData.set("email", data.email);
    formData.set("password", data.password);
    startTransition(() => formAction(formData));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input id="signup-email" type="email" {...register("email")} />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-password">Password</Label>
        <Input id="signup-password" type="password" {...register("password")} />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Create Account
      </Button>
    </form>
  );
}
