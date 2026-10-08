import { NextRequest, NextResponse } from "next/server";
import { isValidSiteSession } from "@/lib/site-auth";

const json = (body: Record<string, unknown>, status = 200, headers?: HeadersInit) =>
  NextResponse.json(body, { status, headers });

export async function GET(request: NextRequest) {
  const secret = process.env.SITE_SESSION_SECRET;
  const session = request.cookies.get("spinmap_session")?.value;
  if (!secret || !(await isValidSiteSession(session, secret))) {
    return json({ error: "Sua sessão expirou. Entre novamente no mapa." }, 401);
  }

  const recipient = process.env.REPORT_TO_EMAIL?.trim();
  if (!recipient) {
    return json({ error: "O envio por e-mail ainda não foi configurado." }, 503);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
    return json({ error: "O endereço de destino do reporte está inválido." }, 503);
  }

  return json({ recipient }, 200, { "Cache-Control": "no-store" });
}
