import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";

  // Force canonical host to www to avoid duplicate crawls.
  if (host === "645sajunumber.com") {
    const url = req.nextUrl.clone();
    url.hostname = "www.645sajunumber.com";
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.jpg|opengraph-image.jpg|robots.txt|sitemap.xml).*)",
  ],
};
