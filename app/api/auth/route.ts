import { NextResponse } from "next/server";
import { constantTimeTextEqual, createSiteSession } from "@/lib/site-auth";

const SESSION_SECONDS = 60 * 60 * 24 * 7;

export async function POST(request: Request) {
  const password = process.env.SITE_PASSWORD;
  const secret = process.env.SITE_SESSION_SECRET;
  if (!password || !secret) return new Response("Acesso temporariamente indisponível.", { status: 503 });

  const form = await request.formData();
  const submitted = form.get("password");
  if (typeof submitted !== "string" || !constantTimeTextEqual(submitted, password)) {
    return NextResponse.redirect(new URL("/login?erro=1", request.url), 303);
  }

  const expiresAt = Date.now() + SESSION_SECONDS * 1000;
  const token = await createSiteSession(secret, expiresAt);
  const response = NextResponse.redirect(new URL("/", request.url), 303);
  response.cookies.set("spinmap_session", token, {
    httpOnly: true,
    secure: new URL(request.url).protocol === "https:",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
  return response;
}
