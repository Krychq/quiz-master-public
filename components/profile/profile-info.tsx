"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Copy, LockKeyhole } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { NicknameForm } from "./nickname-form";
import { ChangePasswordDialog } from "./change-password-dialog";
import { AvatarUploadTrigger } from "./avatar-upload-trigger";

export interface ProfileData {
  id: string;
  email?: string | null;
  nickname: string | null;
  avatar_url: string | null;
}

interface ProfileInfoProps {
  profile: ProfileData;
  isOwnProfile: boolean;
}

export function ProfileInfo({
  profile: initialProfile,
  isOwnProfile,
}: ProfileInfoProps) {
  const [profile, setProfile] = useState(initialProfile);

  useEffect(() => {
    setProfile(initialProfile);
  }, [initialProfile]);

  useEffect(() => {
    if (!isOwnProfile) return;
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setProfile({
          id: session.user.id,
          email: session.user.email,
          nickname: session.user.user_metadata?.nickname,
          avatar_url: session.user.user_metadata?.avatar_url,
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [isOwnProfile]);

  const [copied, setCopied] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleCopyId = async () => {
    await navigator.clipboard.writeText(profile.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Card className="overflow-hidden border-border/50 shadow-sm">
        <div className="h-32 bg-linear-to-br from-primary/20 via-primary/10 to-transparent w-full" />
        <CardContent className="px-6 pb-6 pt-0 sm:px-8 relative">
          <div className="flex flex-col items-center -mt-16 mb-6">
            <AvatarUploadTrigger
              avatarUrl={profile.avatar_url}
              isOwnProfile={isOwnProfile}
            />
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-muted-foreground uppercase text-xs font-bold tracking-wider">
                Nickname
              </Label>
              {isOwnProfile ? (
                <NicknameForm currentNickname={profile.nickname || ""} />
              ) : (
                <span className="text-xl font-semibold">
                  {profile.nickname || "No nickname set"}
                </span>
              )}
            </div>

            {isOwnProfile && (
              <>
                <div className="space-y-1">
                  <Label className="text-muted-foreground uppercase text-xs font-bold tracking-wider">
                    Email
                  </Label>
                  <p className="text-foreground text-sm font-medium">
                    {profile.email}
                  </p>
                </div>

                <div className="space-y-1">
                  <Label className="text-muted-foreground uppercase text-xs font-bold tracking-wider">
                    User ID
                  </Label>
                  <div className="flex items-center gap-2 max-w-full">
                    <code className="bg-muted px-2 py-1.5 rounded text-xs text-muted-foreground truncate flex-1 font-mono">
                      {profile.id}
                    </code>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-7 w-7 shrink-0 bg-transparent"
                      onClick={handleCopyId}
                    >
                      {copied ? (
                        <Check className="h-3 w-3 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-3 pt-6 border-t border-border/50">
                  <Label className="text-muted-foreground uppercase text-xs font-bold tracking-wider">
                    Security
                  </Label>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto gap-2"
                    onClick={() => setIsChangingPassword(true)}
                  >
                    <LockKeyhole className="h-4 w-4" />
                    Change Password
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <ChangePasswordDialog
        open={isChangingPassword}
        onOpenChange={setIsChangingPassword}
      />
    </>
  );
}
