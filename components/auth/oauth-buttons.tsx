"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { Provider } from "@supabase/supabase-js";
import { GoogleIcon } from "@/components/icons/google";
import { DiscordIcon } from "@/components/icons/discord";
import { GitHubIcon } from "@/components/icons/github";

export function OAuthButtons() {
  const handleOAuthLogin = async (provider: Provider) => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    });
  };

  return (
    <div className="flex flex-col gap-3 w-full mt-2">
      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          type="button"
          onClick={() => handleOAuthLogin("google")}
        >
          <GoogleIcon className="mr-2 h-4 w-4" />
          Google
        </Button>
        <Button
          variant="outline"
          type="button"
          onClick={() => handleOAuthLogin("discord")}
        >
          <DiscordIcon className="mr-2 h-4 w-4" />
          Discord
        </Button>
        <Button
          variant="outline"
          type="button"
          onClick={() => handleOAuthLogin("github")}
        >
          <GitHubIcon className="mr-2 h-4 w-4" />
          GitHub
        </Button>
      </div>
    </div>
  );
}
