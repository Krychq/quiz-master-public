'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import {
  loginSchema,
  signupSchema,
  forgotPasswordSchema,
  newPasswordSchema,
} from '@/lib/schemas/auth'
import type { ActionState } from '@/types'

export async function login(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)

  if (error) return { error: error.message }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function signup(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = signupSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp(parsed.data)

  if (error) return { error: error.message }

  if (data?.user?.identities && data.user.identities.length === 0) {
    return { error: 'An account with this email already exists.' }
  }
  
  if (!data?.session) {
    return { success: true, data: 'Please check your email to confirm your account before logging in.' }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function resetPassword(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get('email'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://quiz-master.netlify.app'}/auth/callback?next=/reset-password`,
  })

  if (error) return { error: error.message }

  return { success: true, data: "If an account exists, you'll get an email." }
}

export async function updatePassword(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = newPasswordSchema.safeParse({
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password })

  if (error) return { error: error.message }

  revalidatePath('/', 'layout')
  return { success: true, data: 'Password updated successfully!' }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
}
