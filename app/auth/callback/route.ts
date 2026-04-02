import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: Request) {
  console.log("🚀🚀🚀 [CALLBACK] Ktoś właśnie uderzył w /auth/callback!");
  console.log("🔗 URL requestu:", request.url);

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  console.log("🎫 Kod z URL:", code ? "JEST KOD" : "BRAK KODU");

  const errorCode = searchParams.get("error_code");
  if (errorCode) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/?auth_error=${errorCode}`,
    );
  }

  if (code) {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://quiz-master-public.netlify.app";

    const redirectUrl = new URL(next, baseUrl).toString();
    const response = NextResponse.redirect(redirectUrl, { status: 303 });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return (
              request.headers
                .get("cookie")
                ?.split("; ")
                .map((c) => {
                  const [name, ...rest] = c.split("=");
                  return { name, value: rest.join("=") };
                }) ?? []
            );
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return response;
    }
  }

  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_SITE_URL}/?auth_error=auth-code-error`,
  );
}
