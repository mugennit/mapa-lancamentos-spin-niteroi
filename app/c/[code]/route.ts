// Link curto para clientes (/c/código): abre a vitrine com o corretor e o card
// do lançamento guardados no código. Público, sem dados internos: só leva ao
// endereço da vitrine, que verifica a assinatura do corretor.
import { NextRequest, NextResponse } from "next/server";
import { isValidCode, resolveShortLink, storeFromEnv, vitrinePath } from "@/lib/short-links";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const store = storeFromEnv();
  let target = "/vitrine";
  if (store && isValidCode(code)) {
    try {
      const record = await resolveShortLink(store, code);
      if (record) target = vitrinePath(record);
    } catch { /* banco indisponível: abre a vitrine geral */ }
  }
  const response = NextResponse.redirect(new URL(target, request.url), 302);
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("X-Robots-Tag", "noindex");
  return response;
}
