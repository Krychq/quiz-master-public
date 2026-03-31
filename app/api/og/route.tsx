import React from "react";
import { ImageResponse } from "next/og";
import { db } from "@/db";
import { result, quiz } from "@/db/schema";
import { eq } from "drizzle-orm";
import QRCode from "qrcode";

function formatTimeOG(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

function getTierOG(pct: number) {
  if (pct >= 90) return { label: "LEGENDARY", color: "#f59e0b" };
  if (pct >= 70) return { label: "EXPERT", color: "#a78bfa" };
  if (pct >= 50) return { label: "SKILLED", color: "#34d399" };
  return { label: "CHALLENGER", color: "#f87171" };
}

const BRAND = {
  bg: "#0f0a1a",
  card: "#1a1228",
  border: "#2d2640",
  muted: "#a78bfa",
  fg: "#ffffff",
  primary: "#8b5cf6",
  primaryLight: "#c4b5fd",
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return new Response("Missing ID", { status: 400 });

    const rows = await db
      .select({
        score: result.score,
        total: result.totalQuestions,
        timeSpent: result.timeSpent,
        quizTitle: quiz.title,
      })
      .from(result)
      .leftJoin(quiz, eq(result.quizId, quiz.id))
      .where(eq(result.id, id))
      .limit(1);

    const r = rows[0];
    if (!r) return new Response("Not found", { status: 404 });

    const pct = Math.round((r.score / r.total) * 100);
    const tier = getTierOG(pct);

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || "https://quiz-master.netlify.app";
    const shareUrl = `${baseUrl}/results/${id}`;

    const qrCodeDataUrl = await QRCode.toDataURL(shareUrl, {
      margin: 1,
      width: 220,
      color: {
        dark: "#ffffff",
        light: BRAND.card,
      },
    });

    return new ImageResponse(
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: BRAND.bg,
          fontFamily: "system-ui, sans-serif",
          color: BRAND.fg,
          padding: "60px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "800px",
            height: "800px",
            background: `radial-gradient(circle, ${BRAND.primary}25 0%, transparent 60%)`,
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "16px",
                background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.primaryLight})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="white" />
              </svg>
            </div>
            <span
              style={{ fontSize: "40px", fontWeight: 800, color: "#ffffff" }}
            >
              QuizMaster
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "16px 28px",
              backgroundColor: `${tier.color}25`,
              border: `2px solid ${tier.color}`,
              borderRadius: "100px",
            }}
          >
            <div
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                backgroundColor: tier.color,
                boxShadow: `0 0 10px ${tier.color}`,
              }}
            />
            <span
              style={{
                fontSize: "24px",
                fontWeight: 800,
                letterSpacing: "4px",
                color: tier.color,
              }}
            >
              {tier.label}
            </span>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            marginTop: "20px",
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                marginBottom: "-20px",
              }}
            >
              <span
                style={{
                  fontSize: "240px",
                  fontWeight: 900,
                  lineHeight: 1,
                  letterSpacing: "-10px",
                  color: "#ffffff",
                }}
              >
                {pct}
              </span>
              <span
                style={{
                  fontSize: "90px",
                  fontWeight: 700,
                  color: BRAND.primaryLight,
                  marginLeft: "10px",
                }}
              >
                %
              </span>
            </div>

            <span
              style={{
                fontSize: "36px",
                color: BRAND.fg,
                fontWeight: 600,
                letterSpacing: "10px",
                textTransform: "uppercase",
                marginBottom: "40px",
              }}
            >
              ACCURACY
            </span>

            {/* Stats Row */}
            <div style={{ display: "flex", gap: "60px" }}>
              {[
                { label: "CORRECT", value: `${r.score}/${r.total}` },
                { label: "TIME", value: formatTimeOG(r.timeSpent) },
              ].map((stat, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "20px",
                      color: BRAND.primaryLight,
                      fontWeight: 600,
                      letterSpacing: "4px",
                    }}
                  >
                    {stat.label}
                  </span>
                  <span
                    style={{
                      fontSize: "56px",
                      fontWeight: 800,
                      color: "#ffffff",
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: BRAND.card,
              padding: "30px",
              borderRadius: "32px",
              border: `2px solid ${BRAND.border}`,
              boxShadow: `0 20px 40px rgba(0,0,0,0.5)`,
            }}
          >
            <div
              style={{
                display: "flex",
                padding: "10px",
                border: `6px solid ${BRAND.primary}`,
                borderRadius: "16px",
                marginBottom: "24px",
              }}
            >
              <img src={qrCodeDataUrl} width="220" height="220" />
            </div>
            <span
              style={{
                fontSize: "28px",
                fontWeight: 800,
                color: "#ffffff",
                letterSpacing: "2px",
              }}
            >
              SCAN TO BEAT ME
            </span>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "8px",
            background: `linear-gradient(90deg, ${BRAND.primary}, ${tier.color})`,
            display: "flex",
          }}
        />
      </div>,
      { width: 1200, height: 630 },
    );
  } catch (e: unknown) {
    console.error("OG error:", e);
    return new Response("Server error", { status: 500 });
  }
}
