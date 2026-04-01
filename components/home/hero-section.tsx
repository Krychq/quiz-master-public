import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { QuickGameForm } from "@/components/home/quick-game-form";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-20 left-20 h-60 w-60 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute right-20 top-40 h-60 w-60 rounded-full bg-accent/20 blur-3xl" />
      </div>

      <Card className="relative w-full max-w-md border-border/50 bg-card/80 shadow-2xl shadow-primary/10 backdrop-blur-sm">
        <CardHeader className="space-y-1 pb-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
            Start a Quick Game
          </CardTitle>
          <p className="text-pretty text-sm text-muted-foreground">
            Select your preferences and jump into a quiz
          </p>
        </CardHeader>

        <QuickGameForm />
      </Card>
    </section>
  );
}
