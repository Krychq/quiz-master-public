import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  const errorCode = searchParams.get("error_code");
  if (errorCode) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/?auth_error=${errorCode}`,
    );
  }

  if (code) {
    const response = NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}${next}`,
      { status: 307 },
    );
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
