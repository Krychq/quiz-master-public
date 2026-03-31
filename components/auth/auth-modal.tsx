"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OAuthButtons } from "./oauth-buttons";
import { LoginForm } from "./login-form";
import { SignupForm } from "./signup-form";
import { ForgotPasswordForm } from "./forgot-password-form";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

type View = "tabs" | "forgot_password";

export function AuthModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<View>("tabs");
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("login") === "true") {
      setIsOpen(true);
      const url = new URL(window.location.href);
      url.searchParams.delete("login");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams]);

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => setView("tabs"), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleLoginSuccess = () => setIsOpen(false);

  const handleSignupSuccess = (message?: string) => {
    setIsOpen(false);
    if (message) {
      toast.success("Account Created!", { description: message });
    }
  };

  const handleResetSuccess = (message: string) => {
    setView("tabs");
    toast.success("If an account exists, you'll get an email.", {
      description: message,
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Sign In</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Authentication</DialogTitle>
          <DialogDescription>
            {view === "tabs"
              ? "Login or create a new account to save your quiz results."
              : "Reset your password."}
          </DialogDescription>
        </DialogHeader>

        {view === "tabs" ? (
          <>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <LoginForm
                  onSuccess={handleLoginSuccess}
                  onForgotPassword={() => setView("forgot_password")}
                />
              </TabsContent>
              <TabsContent value="signup">
                <SignupForm onSuccess={handleSignupSuccess} />
              </TabsContent>
            </Tabs>
            <OAuthButtons />
          </>
        ) : (
          <ForgotPasswordForm
            onBack={() => setView("tabs")}
            onSuccess={handleResetSuccess}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
