import { Target, Timer, Clock } from "lucide-react";

interface ResultsStatsSummaryProps {
  percentage: number;
  timeSpentFormatted: string;
  accuracyLabel: string;
}

export function ResultsStatsSummary({
  percentage,
  timeSpentFormatted,
  accuracyLabel
}: ResultsStatsSummaryProps) {
  return (
    <section className="border-y border-border bg-muted/30 px-4 py-6">
      <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-6 md:gap-12">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Percentage</p>
            <p className="font-semibold text-foreground">{percentage}%</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Timer className="h-5 w-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Time Spent</p>
            <p className="font-semibold text-foreground">
              {timeSpentFormatted}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Accuracy</p>
            <p className="font-semibold text-foreground">{accuracyLabel}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
