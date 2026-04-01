"use client";

import { useState, useTransition } from "react";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Slider } from "@/components/ui/slider";
import { Loader2 } from "lucide-react";
import { createQuickGame } from "@/app/actions/quiz";
import { categories } from "@/lib/constants";

export function QuickGameForm() {
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
    <CardContent className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Category</label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full" aria-label="Select Quiz Category">
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
        className="w-full max-w-sm mx-auto flex"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating questions...
          </>
        ) : (
          "Challenge Me!"
        )}
      </Button>
    </CardContent>
  );
}
