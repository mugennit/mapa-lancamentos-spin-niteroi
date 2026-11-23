// Gera o link de divulgação do corretor. Só funciona com a sessão da área
// interna (senha atual); não cria login individual.
import { NextRequest, NextResponse } from "next/server";
import { isValidSiteSession } from "@/lib/site-auth";
import { createBrokerToken, normalizeBrokerName, normalizeWhatsApp } from "@/lib/broker-link";

export async function POST(request: NextRequest) {
  const secret = process.env.SITE_SESSION_SECRET;
  if (!secret || !(await isValidSiteSession(request.cookies.get("spinmap_session")?.value, secret))) {
    return NextResponse.json({ error: "Sua sessão expirou. Entre novamente no mapa." }, { status: 401 });
  }
  const body = (await request.json().catch(() => ({}))) as { name?: unknown; phone?: unknown };
  const name = typeof body.name === "string" ? normalizeBrokerName(body.name) : null;
  const phone = typeof body.phone === "string" ? normalizeWhatsApp(body.phone) : null;
  if (!name) return NextResponse.json({ error: "Informe seu nome (2 a 60 caracteres)." }, { status: 400 });
  if (!phone) return NextResponse.json({ error: "Informe um WhatsApp brasileiro com DDD." }, { status: 400 });
  const token = await createBrokerToken({ name, phone }, secret);
  const url = new URL("/vitrine", request.url);
  url.searchParams.set("c", token);
  return NextResponse.json({ url: url.toString(), name, phone }, { headers: { "Cache-Control": "no-store" } });
}
