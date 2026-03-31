import { z } from "zod";

export const nicknameSchema = z.object({
  nickname: z
    .string()
    .min(1, "Nickname cannot be empty.")
    .max(30, "Nickname must be 30 characters or fewer.")
    .trim(),
});

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Current password is required."),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters.")
      .max(72, "Password must be less than 72 characters."),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type NicknameSchema = z.infer<typeof nicknameSchema>;
export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
