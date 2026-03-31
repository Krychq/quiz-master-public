import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(72, "Password must be less than 72 characters."),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

export const newPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters.").max(72),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type LoginSchema = z.infer<typeof loginSchema>;
export type SignupSchema = z.infer<typeof signupSchema>;
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type NewPasswordSchema = z.infer<typeof newPasswordSchema>;
