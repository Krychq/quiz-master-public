"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Zap,
  Compass,
  PlusCircle,
  Trophy,
  LogOut,
  User,
  Home,
} from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import Link from "next/link";
import { AuthModal } from "@/components/auth/auth-modal";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { logout } from "@/app/actions/auth";
import { UserAvatar } from "@/components/ui/user-avatar";

export function Header({ user: serverUser }: { user: any }) {
  const [user, setUser] = useState(serverUser);
  const router = useRouter();

  useEffect(() => {
    setUser(serverUser);
  }, [serverUser]);

  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        setUser(null);
        router.push("/");
        router.refresh();
      } else if (session) {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">QuizMaster</span>
        </a>

        {/* Navigation */}
        <nav className="hidden items-center gap-1 sm:flex">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            asChild
          >
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            asChild
          >
            <Link href="/#discover-section">
              <Compass className="mr-2 h-4 w-4" />
              Discover
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            asChild
          >
            <Link href="/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Quiz
            </Link>
          </Button>
        </nav>

        {/* Auth Section */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-9 w-9 rounded-full"
                >
                  <UserAvatar
                    src={user?.user_metadata?.avatar_url}
                    alt="User avatar"
                    className="h-9 w-9"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link
                    href="/create"
                    className="w-full flex items-center cursor-pointer sm:hidden"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Quiz
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/profile"
                    className="w-full flex items-center cursor-pointer"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/my-results"
                    className="w-full flex items-center cursor-pointer"
                  >
                    <Trophy className="mr-2 h-4 w-4" />
                    My Results
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    router.push("/");
                    logout();
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <AuthModal />
          )}
        </div>
      </div>
    </header>
  );
}
