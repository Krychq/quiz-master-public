import { Button } from "@/components/ui/button";
import { Zap, Compass, PlusCircle, Home } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import Link from "next/link";
import { UserAuthSection } from "@/components/layout/header/user-auth-section"; // Twój nowy komponent

export function Header({ user }: { user: any }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo - NAPRAWIONE: Użycie Link zamiast <a> */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">QuizMaster</span>
        </Link>

        {/* Navigation - Czysty HTML z serwera */}
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
          {/* Wydzielona logika kliencka */}
          <UserAuthSection initialUser={user} />
        </div>
      </div>
    </header>
  );
}
