import { NextRequest, NextResponse } from "next/server";
import { isValidSiteSession } from "@/lib/site-auth";

export async function proxy(request: NextRequest) {
  const secret = process.env.SITE_SESSION_SECRET;
  const token = request.cookies.get("spinmap_session")?.value;

  if (secret && (await isValidSiteSession(token, secret))) return NextResponse.next();
  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ["/((?!login|api/auth|api/logout|_next/static|_next/image|favicon.ico|robots.txt).*)"],
};
