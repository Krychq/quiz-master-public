import type { MetadataRoute } from "next";
import { db } from "@/db";
import { quiz } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://quiz-master.netlify.app";

  const publicQuizzes = await db
    .select({
      id: quiz.id,
      updatedAt: quiz.createdAt,
      userId: quiz.userId,
    })
    .from(quiz)
    .where(eq(quiz.visibility, "PUBLIC"));

  const quizUrls: MetadataRoute.Sitemap = publicQuizzes.map((q) => ({
    url: `${baseUrl}/quiz/${q.id}`,
    lastModified: q.updatedAt || new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const activeUserIds = [...new Set(publicQuizzes.map((q) => q.userId))];

  const profileUrls: MetadataRoute.Sitemap = activeUserIds.map((userId) => ({
    url: `${baseUrl}/profile/${userId}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.6,
  }));

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/create`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  return [...staticRoutes, ...quizUrls, ...profileUrls];
}
