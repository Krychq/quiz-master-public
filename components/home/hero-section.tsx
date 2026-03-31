"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Slider } from "@/components/ui/slider";
import { Loader2, Play, Sparkles } from "lucide-react";
import { createQuickGame } from "@/app/actions/quiz";
import { categories } from "@/lib/constants";

export function HeroSection() {
  const [category, setCategory] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("medium");
  const [questionCount, setQuestionCount] = useState<number[]>([10]);

  const [isPending, startTransition] = useTransition();

  const handlePlayNow = () => {
    startTransition(async () => {
      await createQuickGame(questionCount[0], category, difficulty);
    });
  };

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
        <CardContent className="space-y-6">
          {/* Category Select */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Category
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger
                className="w-full"
                aria-label="Select Quiz Category"
              >
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Difficulty
            </label>
            <ToggleGroup
              type="single"
              value={difficulty}
              onValueChange={(value) => value && setDifficulty(value)}
              className="w-full justify-stretch"
              variant="outline"
            >
              <ToggleGroupItem
                value="easy"
                className="flex-1 data-[state=on]:bg-green-100 data-[state=on]:text-green-700 dark:data-[state=on]:bg-green-900/30 dark:data-[state=on]:text-green-400"
              >
                Easy
              </ToggleGroupItem>
              <ToggleGroupItem
                value="medium"
                className="flex-1 data-[state=on]:bg-amber-100 data-[state=on]:text-amber-700 dark:data-[state=on]:bg-amber-900/30 dark:data-[state=on]:text-amber-400"
              >
                Medium
              </ToggleGroupItem>
              <ToggleGroupItem
                value="hard"
                className="flex-1 data-[state=on]:bg-red-100 data-[state=on]:text-red-700 dark:data-[state=on]:bg-red-900/30 dark:data-[state=on]:text-red-400"
              >
                Hard
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                Number of Questions
              </label>
              <span className="text-sm font-semibold text-primary">
                {questionCount[0]} Questions
              </span>
            </div>
            <Slider
              value={questionCount}
              onValueChange={setQuestionCount}
              min={5}
              max={20}
              step={1}
              className="w-full"
              aria-label="Select Number of Questions"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>5</span>
              <span>20</span>
            </div>
          </div>

          <Button
            onClick={handlePlayNow}
            disabled={isPending}
            size="lg"
            className="w-full max-w-sm"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generowanie pytań...
              </>
            ) : (
              "Graj teraz"
            )}
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
