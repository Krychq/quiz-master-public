"use client";

import { useState, useTransition, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Loader2, User as UserIcon } from "lucide-react";
import getCroppedImg from "@/lib/crop-image";
import { CropAvatarDialog, PixelCrop } from "./crop-avatar-dialog";
import { uploadAvatar } from "@/app/actions/user";
import { createClient } from "@/lib/supabase/client";
import { UserAvatar } from "../ui/user-avatar";
import { cn } from "@/lib/utils";

interface AvatarUploadTriggerProps {
  avatarUrl: string | null;
  isOwnProfile: boolean;
}

export function AvatarUploadTrigger({
  avatarUrl,
  isOwnProfile,
}: AvatarUploadTriggerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const handleAvatarClick = () => {
    if (isOwnProfile) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageSrc(URL.createObjectURL(file));
    setCropModalOpen(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCropModalClose = (open: boolean) => {
    setCropModalOpen(open);
    if (!open) {
      setTimeout(() => {
        if (imageSrc?.startsWith("blob:")) URL.revokeObjectURL(imageSrc);
        setImageSrc(null);
      }, 300);
    }
  };

  const handleApplyCrop = async (croppedAreaPixels: PixelCrop) => {
    if (!imageSrc || !croppedAreaPixels) return;

    setIsUploading(true);
    setCropModalOpen(false);
    setUploadError(null);

    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (!croppedBlob) throw new Error("Could not crop image");

      const formData = new FormData();
      formData.append(
        "file",
        new File([croppedBlob], "avatar.webp", { type: "image/webp" }),
      );

      startTransition(async () => {
        const res = await uploadAvatar(formData);
        if (res?.error) {
          setUploadError(res.error);
        } else {
          await createClient().auth.refreshSession();
        }
        setIsUploading(false);
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to crop image";
      setUploadError(msg);
      setIsUploading(false);
    }
  };

  const busy = isUploading || isPending;

  return (
    <div className="flex flex-col items-center">
      <div
        className={cn("relative group", isOwnProfile && "hover:cursor-pointer")}
        onClick={handleAvatarClick}
      >
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
          disabled={busy || !isOwnProfile}
        />
        <UserAvatar
          src={avatarUrl}
          alt="User Avatar"
          imageProps={{
            height: 128,
            width: 128,
          }}
          className={`h-32 w-32 border-4 border-background shadow-xl ${busy ? "opacity-50" : ""}`}
        />
        {isOwnProfile && (
          <>
            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
              {busy ? (
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              ) : (
                <Camera className="h-8 w-8 text-white" />
              )}
            </div>
            <div className="absolute bottom-1 right-2 bg-background border border-border shadow-sm rounded-full p-2 cursor-pointer hover:bg-muted transition-colors">
              {busy ? (
                <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
              ) : (
                <Camera className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </>
        )}
      </div>

      {uploadError && (
        <p className="text-destructive text-sm font-medium text-center mt-4">
          {uploadError}
        </p>
      )}

      <CropAvatarDialog
        open={cropModalOpen}
        onOpenChange={handleCropModalClose}
        imageSrc={imageSrc}
        onApply={handleApplyCrop}
        isBusy={busy}
      />
    </div>
  );
}
