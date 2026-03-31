import { db } from "@/db";
import { quiz } from "@/db/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { type User } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import { ProfileInfo, ProfileData } from "@/components/profile/profile-info";
import { QuizShareButtons } from "@/components/profile/quiz-share-buttons";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import {
  Globe,
  Lock,
  Link as LinkIcon,
  PlusCircle,
  User as UserIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import QRCode from "qrcode";
import type { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata(
  { params }: { params: Promise<{ userId: string }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { userId } = await params;
  const rows = await db.execute(sql`
    SELECT raw_user_meta_data->>'nickname' as nickname
    FROM auth.users 
    WHERE id = ${userId}
  `);

  const nickname =
    rows.length > 0
      ? (rows[0] as { nickname: string | null }).nickname
      : "User";
  const title = `${nickname || "User"}'s Profile – QuizMaster`;
  const description = `View ${nickname || "User"}'s public quizzes on QuizMaster!`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

function VisibilityBadge({
  visibility,
}: {
  visibility: "PUBLIC" | "PRIVATE" | "WITH_LINK";
}) {
  if (visibility === "PUBLIC") {
    return (
      <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-green-100 text-green-700 border border-green-200">
        <Globe className="h-3 w-3" /> Public
      </span>
    );
  }
  if (visibility === "PRIVATE") {
    return (
      <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
        <Lock className="h-3 w-3" /> Private
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 border border-blue-200">
      <LinkIcon className="h-3 w-3" /> Unlisted
    </span>
  );
}

async function getTargetProfile(
  userId: string,
  user: User | null,
): Promise<ProfileData> {
  if (user?.id === userId) {
    return {
      id: user.id,
      email: user.email,
      nickname: user.user_metadata?.nickname || null,
      avatar_url: user.user_metadata?.avatar_url || null,
    };
  }

  const rows = await db.execute(sql`
    SELECT 
      raw_user_meta_data->>'nickname' as nickname, 
      raw_user_meta_data->>'avatar_url' as avatar_url
    FROM auth.users 
    WHERE id = ${userId}
  `);

  if (rows.length === 0) {
    notFound();
  }

  const row = rows[0] as { nickname: string | null; avatar_url: string | null };
  return {
    id: userId,
    nickname: row.nickname,
    avatar_url: row.avatar_url,
  };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const targetProfile = await getTargetProfile(userId, user);
  const isOwnProfile = user?.id === userId;

  const quizzesFilter = isOwnProfile
    ? eq(quiz.userId, targetProfile.id)
    : and(eq(quiz.userId, targetProfile.id), eq(quiz.visibility, "PUBLIC"));

  const createdQuizzes = await db
    .select()
    .from(quiz)
    .where(quizzesFilter)
    .orderBy(desc(quiz.createdAt));

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://quiz-master.netlify.app";
  const quizzesWithQr = await Promise.all(
    createdQuizzes.map(async (q) => ({
      ...q,
      qrDataUrl: await QRCode.toDataURL(`${siteUrl}/quiz/${q.id}`, {
        width: 200,
        margin: 1,
        color: { dark: "#000000", light: "#ffffff" },
      }),
    })),
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: targetProfile.nickname || "User",
      image: targetProfile.avatar_url || "",
    },
    url: `${siteUrl}/profile/${userId}`,
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <UserIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {isOwnProfile
                ? "My Profile"
                : `${targetProfile.nickname || "User"}'s Profile`}
            </h1>
            <p className="text-muted-foreground">
              {isOwnProfile
                ? "Manage your account and view your created content."
                : "View public quizzes created by this user."}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 w-full">
            <ProfileInfo profile={targetProfile} isOwnProfile={isOwnProfile} />
          </div>

          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold text-foreground">
                {isOwnProfile ? "My Quizzes" : "Public Quizzes"}
              </h2>
              {isOwnProfile && (
                <Link href="/create">
                  <Button size="sm" variant="outline" className="gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Create New
                  </Button>
                </Link>
              )}
            </div>

            {quizzesWithQr.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground flex flex-col items-center justify-center">
                  <p>
                    {isOwnProfile
                      ? "You haven't created any quizzes yet."
                      : "This user hasn't published any public quizzes."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              quizzesWithQr.map((q) => (
                <Card
                  key={q.id}
                  className="flex flex-col sm:flex-row hover:shadow-md transition-shadow overflow-hidden group"
                >
                  <div className="flex-1 min-w-0 p-5 sm:p-6 flex flex-col justify-center bg-card">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <Link href={`/quiz/${q.id}`}>
                        <h3
                          className="text-xl font-bold tracking-tight text-foreground line-clamp-1 group-hover:text-primary transition-colors"
                          title={q.title}
                        >
                          {q.title}
                        </h3>
                      </Link>
                      <VisibilityBadge visibility={q.visibility} />
                    </div>
                    {q.description && (
                      <p className="text-sm text-foreground/80 line-clamp-2 mb-3">
                        {q.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-auto font-medium">
                      Created{" "}
                      {formatDistanceToNow(q.createdAt, { addSuffix: true })}
                    </p>
                  </div>
                  <div className="flex flex-col justify-center p-5 sm:p-6 w-full sm:w-auto shrink-0 border-t sm:border-t-0 sm:border-l border-border/50 bg-muted/10">
                    <QuizShareButtons
                      quizId={q.id}
                      quizTitle={q.title}
                      qrDataUrl={q.qrDataUrl}
                    />
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
