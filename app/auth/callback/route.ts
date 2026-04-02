import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  console.log("🚀🚀🚀 [CALLBACK] Ktoś właśnie uderzył w /auth/callback!");
  console.log("🔗 URL requestu:", request.url);

  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  console.log("🎫 Kod z URL:", code ? "JEST KOD" : "BRAK KODU");

  // 1. Klonujemy URL, żeby zachować domenę produkcyjną
  const redirectUrl = request.nextUrl.clone();

  // 2. MORDUJEMY PARAMETRY! Dzięki temu Netlify nie ma czego doklejać.
  redirectUrl.search = "";

  const errorCode = searchParams.get("error_code");
  if (errorCode) {
    redirectUrl.pathname = "/";
    redirectUrl.search = `?auth_error=${errorCode}`;
    return NextResponse.redirect(redirectUrl);
  }

  if (!code) {
    redirectUrl.pathname = "/";
    redirectUrl.search = "?auth_error=code-missing";
    return NextResponse.redirect(redirectUrl);
  }

  // 3. Ustawiamy czystą ścieżkę powrotną (np. "/")
  redirectUrl.pathname = next;

  // 4. Tworzymy przekierowanie 303 (See Other)
  const response = NextResponse.redirect(redirectUrl, { status: 303 });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          // NextRequest robi to za nas - koniec z mapowaniem stringów!
          return request.cookies.getAll();
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

  if (error) {
    redirectUrl.pathname = "/";
    redirectUrl.search = "?auth_error=auth-code-error";
    return NextResponse.redirect(redirectUrl);
  }

  // Zwracamy naszą sterylnie czystą odpowiedź z kodem 303
  return response;
}
