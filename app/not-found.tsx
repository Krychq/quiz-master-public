"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Sparkles } from "lucide-react";

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-dvh w-full flex flex-col items-center justify-center bg-background px-4 text-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating question marks */}
        {mounted && (
          <>
            <div className="absolute top-[10%] left-[10%] text-6xl text-primary/10 animate-float-slow">
              ?
            </div>
            <div className="absolute top-[20%] right-[15%] text-4xl text-primary/15 animate-float-medium">
              ?
            </div>
            <div className="absolute bottom-[30%] left-[20%] text-5xl text-primary/10 animate-float-fast">
              ?
            </div>
            <div className="absolute bottom-[15%] right-[10%] text-7xl text-primary/5 animate-float-slow">
              ?
            </div>
            <div className="absolute top-[40%] left-[5%] text-3xl text-primary/10 animate-float-medium">
              ?
            </div>
            <div className="absolute top-[60%] right-[25%] text-4xl text-primary/10 animate-float-fast">
              ?
            </div>
          </>
        )}

        {/* Subtle gradient orbs */}
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Large 404 display */}
        <div className="relative mb-6">
          <h1
            className={`text-[120px] md:text-[180px] lg:text-[220px] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-primary/80 to-primary/20 leading-none select-none transition-all duration-700 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            404
          </h1>

          {/* Decorative sparkle */}
          <div
            className={`absolute -top-2 -right-2 md:top-0 md:right-4 transition-all duration-700 delay-300 ${
              mounted ? "opacity-100 scale-100" : "opacity-0 scale-0"
            }`}
          >
            <div className="relative">
              <Sparkles className="h-8 w-8 md:h-10 md:w-10 text-primary animate-pulse" />
              <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full" />
            </div>
          </div>
        </div>

        {/* Text content */}
        <div
          className={`space-y-3 mb-10 max-w-md transition-all duration-700 delay-150 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Oops! Quiz not found
          </h2>
          <p className="text-muted-foreground text-base md:text-lg text-balance leading-relaxed">
            Looks like this quiz has wandered off. It might have been deleted,
            or perhaps the link took a wrong turn.
          </p>
        </div>

        {/* Action buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-3 w-full max-w-sm sm:max-w-none sm:w-auto transition-all duration-700 delay-300 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Button
            asChild
            size="lg"
            className="h-12 px-8 text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
          >
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Back to Home
            </Link>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="h-12 px-8 text-base font-semibold border-2 hover:bg-accent transition-all"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Go Back
          </Button>
        </div>

        {/* Fun suggestion */}
        <p
          className={`mt-12 text-sm text-muted-foreground transition-all duration-700 delay-500 ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
        >
          Why not try a{" "}
          <Link
            href="/"
            className="text-primary hover:underline underline-offset-4 font-medium"
          >
            random quiz
          </Link>{" "}
          instead?
        </p>
      </div>

      {/* Bottom decorative line */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* Custom animations */}
      <style jsx>{`
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        @keyframes float-medium {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(-5deg);
          }
        }
        @keyframes float-fast {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(3deg);
          }
        }
        :global(.animate-float-slow) {
          animation: float-slow 6s ease-in-out infinite;
        }
        :global(.animate-float-medium) {
          animation: float-medium 4s ease-in-out infinite;
        }
        :global(.animate-float-fast) {
          animation: float-fast 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
