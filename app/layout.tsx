import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/layout/theme-provider";
import "./globals.css";
import { Toaster } from "sonner";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { getUser } from "@/lib/supabase/server";
import { UrlToastHandler } from "@/components/auth/url-toast-handler";
import { HideOnQuizEngine } from "@/components/layout/hide-on-quiz-engine";
import { Suspense } from "react";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://quiz-master.netlify.app",
  ),
  title: "QuizMaster - Play & Create Quizzes",
  description:
    "Challenge yourself with trivia, create custom quizzes, and compete with friends.",
  generator: "v0.app",
  authors: [{ name: "Krystian Urban", url: "https://urbandev.netlify.app" }],
  keywords: [
    "quiz",
    "trivia",
    "games",
    "create quizzes",
    "play quizzes",
    "compete with friends",
  ],
  openGraph: {
    title: "QuizMaster - Play & Create Quizzes",
    description:
      "Challenge yourself with trivia, create custom quizzes, and compete with friends.",
    url: "/",
    siteName: "QuizMaster",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QuizMaster - Play & Create Quizzes",
    description:
      "Challenge yourself with trivia, create custom quizzes, and compete with friends.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className="font-sans antialiased min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <HideOnQuizEngine>
            <Header user={user} />
          </HideOnQuizEngine>
          <Suspense>
            <UrlToastHandler />
          </Suspense>
          {children}

          <HideOnQuizEngine>
            <Footer />
          </HideOnQuizEngine>
        </ThemeProvider>
        <Analytics />
        <Toaster
          position="bottom-right"
          richColors
          closeButton
          theme="system"
        />
      </body>
    </html>
  );
}
