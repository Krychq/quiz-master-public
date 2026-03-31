"use client";

import { useState, useActionState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Loader2, Pencil, X } from "lucide-react";
import { updateNickname } from "@/app/actions/user";
import { nicknameSchema, type NicknameSchema } from "@/lib/schemas/user";
import { createClient } from "@/lib/supabase/client";
import type { ActionState } from "@/types";

interface NicknameFormProps {
  currentNickname: string;
}

export function NicknameForm({ currentNickname }: NicknameFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    updateNickname,
    null,
  );
  const [, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NicknameSchema>({
    resolver: zodResolver(nicknameSchema),
    defaultValues: { nickname: currentNickname },
  });

  useEffect(() => {
    if (state?.success) {
      createClient().auth.refreshSession();
      setIsEditing(false);
    }
  }, [state]);

  const onSubmit = (data: NicknameSchema) => {
    const formData = new FormData();
    formData.set("nickname", data.nickname);
    startTransition(() => formAction(formData));
  };

  const cancelEdit = () => {
    reset({ nickname: currentNickname });
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="flex items-center justify-between group rounded-md p-1 -m-1 hover:bg-muted/50 transition-colors">
        <span className="text-xl font-semibold">
          {currentNickname || "Player"}
        </span>
        <Button
          size="icon"
          variant="ghost"
          className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
          onClick={() => setIsEditing(true)}
        >
          <Pencil className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Input
          {...register("nickname")}
          placeholder="Enter nickname"
          className="focus-visible:ring-primary"
          autoFocus
          disabled={isPending}
        />
        <Button
          type="submit"
          size="icon"
          variant="ghost"
          className="text-green-600 hover:text-green-700 hover:bg-green-100"
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Check className="h-4 w-4" />
          )}
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="text-red-600 hover:text-red-700 hover:bg-red-100"
          onClick={cancelEdit}
          disabled={isPending}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      {errors.nickname && (
        <p className="text-destructive text-sm font-medium">
          {errors.nickname.message}
        </p>
      )}
      {state?.error && (
        <p className="text-destructive text-sm font-medium">{state.error}</p>
      )}
    </form>
  );
}
