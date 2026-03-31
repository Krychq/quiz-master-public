import { Zap } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-border/50 px-6 py-6 flex items-center justify-between relative">
      <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-linear-to-br from-indigo-500 to-indigo-400 flex items-center justify-center">
          <Zap className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="hidden sm:block text-sm font-medium">QuizMaster</span>
      </div>

      <p className="text-xs text-muted-foreground text-center w-full">
        © {new Date().getFullYear()} QuizMaster. All rights reserved.{" "}
        <br className="sm:hidden" />
        Developed by:{" "}
        <Link
          href="https://urbandev.netlify.app"
          className="hover:text-foreground transition-colors font-bold"
          target="_blank"
          rel="noopener noreferrer"
        >
          Krystian Urban
        </Link>
      </p>
    </footer>
  );
}
