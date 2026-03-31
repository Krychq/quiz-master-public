"use client";

import { useActionState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updatePassword } from "@/app/actions/user";
import {
  changePasswordSchema,
  type ChangePasswordSchema,
} from "@/lib/schemas/user";
import { toast } from "sonner";
import type { ActionState } from "@/types";

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChangePasswordDialog({
  open,
  onOpenChange,
}: ChangePasswordDialogProps) {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    updatePassword,
    null,
  );
  const [, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
  });

  useEffect(() => {
    if (state?.success) {
      toast.success("Password updated!", {
        description: state.data as string,
      });
      reset();
      onOpenChange(false);
    }
  }, [state, onOpenChange, reset]);

  const handleOpenChange = (open: boolean) => {
    if (!open) reset();
    onOpenChange(open);
  };

  const onSubmit = (data: ChangePasswordSchema) => {
    const formData = new FormData();
    formData.set("oldPassword", data.oldPassword);
    formData.set("newPassword", data.newPassword);
    formData.set("confirmPassword", data.confirmPassword);
    startTransition(() => formAction(formData));
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          {/* Current Password */}
          <div className="space-y-2">
            <Label htmlFor="old-password">Current Password</Label>
            <Input
              id="old-password"
              type="password"
              {...register("oldPassword")}
              placeholder="Enter current password"
              autoFocus
              disabled={isPending}
            />
            {errors.oldPassword && (
              <p className="text-destructive text-sm">
                {errors.oldPassword.message}
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              {...register("newPassword")}
              placeholder="At least 8 characters"
              disabled={isPending}
            />
            {errors.newPassword && (
              <p className="text-destructive text-sm">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              {...register("confirmPassword")}
              placeholder="Confirm new password"
              disabled={isPending}
            />
            {errors.confirmPassword && (
              <p className="text-destructive text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Server error (e.g. wrong current password) */}
          {state?.error && (
            <p className="text-destructive text-sm font-medium">
              {state.error}
            </p>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Password
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
