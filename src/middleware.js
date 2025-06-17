import { NextResponse } from "next/server";

export function middleware(request) {
  const locales = ["en", "ar"];
  const currencies = ["aed", "sar", "omr"];
  const url = request.nextUrl.clone();
  const { pathname } = url;

  if (pathname.startsWith("/_next/") || pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  const cookieLang = request.cookies.get("NEXT_LOCALE")?.value?.toLowerCase();

  const defaultLang = locales.includes(cookieLang) ? cookieLang : "en";
  const cookieCurrency = request.cookies
    .get("NEXT_CURRENCY")
    ?.value?.toLowerCase();
  const defaultCurr = currencies.includes(cookieCurrency)
    ? cookieCurrency
    : "aed";

  const lang = locales.includes(segments[0]?.toLowerCase())
    ? segments[0].toLowerCase()
    : null;
  const curr = currencies.includes(segments[1]?.toLowerCase())
    ? segments[1].toLowerCase()
    : null;

  const response = NextResponse.next();

  if (lang && request.cookies.get("NEXT_LOCALE")?.value !== lang) {
    response.cookies.set("NEXT_LOCALE", lang);
  }

  if (curr && request.cookies.get("NEXT_CURRENCY")?.value !== curr) {
    response.cookies.set("NEXT_CURRENCY", curr);
  }

  if (!lang || !curr) {
    const newLang = lang || defaultLang;
    const newCurr = curr || defaultCurr;

    const filteredSegments = segments.filter(
      (seg) =>
        !locales.includes(seg.toLowerCase()) &&
        !currencies.includes(seg.toLowerCase()),
    );

    const newPath =
    `/${newLang}/${newCurr}/${filteredSegments.join("/")}`.replace(/\/$/, "");
    url.pathname = newPath;
    return NextResponse.redirect(url);
  }

  return response;
}
