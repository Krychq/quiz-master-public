"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { nicknameSchema, changePasswordSchema } from "@/lib/schemas/user";
import type { ActionState } from "@/types";

export async function updateNickname(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = nicknameSchema.safeParse({
    nickname: formData.get("nickname"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const { error } = await supabase.auth.updateUser({
    data: { nickname: parsed.data.nickname },
  });

  if (error) return { success: false, error: error.message };

  revalidatePath(`/profile/${user.id}`, "page");
  return { success: true };
}

export async function uploadAvatar(formData: FormData): Promise<ActionState> {
  try {
    const supabase = await createClient();

    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, error: "No file provided" };
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const fileName = `${user.id}-${Math.random()}.webp`;
    const filePath = `${user.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, buffer, {
        upsert: true,
        contentType: "image/webp",
      });

    if (uploadError) return { success: false, error: uploadError.message };

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath);

    const { error: updateError } = await supabase.auth.updateUser({
      data: { avatar_url: publicUrl },
    });

    if (updateError) return { success: false, error: updateError.message };

    revalidatePath(`/profile/${user.id}`, "page");
    return { success: true, data: publicUrl };
  } catch (error) {
    console.error("Unexpected error in uploadAvatar:", error);
    return {
      success: false,
      error: "An unexpected error occurred during upload",
    };
  }
}

export async function updatePassword(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = changePasswordSchema.safeParse({
    oldPassword: formData.get("oldPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return { success: false, error: "Not authenticated" };
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: parsed.data.oldPassword,
  });

  if (signInError) {
    return { success: false, error: "Incorrect current password." };
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password: parsed.data.newPassword,
  });

  if (updateError) return { success: false, error: updateError.message };

  return { success: true, data: "Password updated successfully!" };
}
