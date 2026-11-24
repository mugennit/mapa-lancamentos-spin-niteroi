// Gera o link de divulgação do corretor. Só funciona com a sessão da área
// interna (senha atual); não cria login individual.
// Com o banco de links configurado, devolve o link CURTO (/c/código), que abre
// direto o card do lançamento escolhido; sem ele, o link longo assinado.
import { NextRequest, NextResponse } from "next/server";
import catalog from "@/data/catalog.json";
import materials from "@/data/materials.json";
import { isValidSiteSession } from "@/lib/site-auth";
import { createBrokerToken, normalizeBrokerName, normalizeWhatsApp } from "@/lib/broker-link";
import { isMapEligible } from "@/lib/catalog-rules";
import { createShortLink, storeFromEnv, vitrinePath } from "@/lib/short-links";

const NO_STORE = { "Cache-Control": "private, no-store" };

export async function POST(request: NextRequest) {
  const secret = process.env.SITE_SESSION_SECRET;
  if (!secret || !(await isValidSiteSession(request.cookies.get("spinmap_session")?.value, secret))) {
    return NextResponse.json({ error: "Sua sessão expirou. Entre novamente no mapa." }, { status: 401, headers: NO_STORE });
  }
  // Chave exclusiva dos links (separada da chave de sessão): trocar a senha ou a
  // sessão não invalida os links já enviados aos clientes.
  const linkSecret = process.env.BROKER_LINK_SECRET;
  if (!linkSecret || linkSecret.length < 16) {
    return NextResponse.json({ error: "Os links para clientes ainda não foram configurados (falta a chave BROKER_LINK_SECRET)." }, { status: 503, headers: NO_STORE });
  }
  const body = (await request.json().catch(() => ({}))) as { name?: unknown; phone?: unknown; projectId?: unknown };
  const name = typeof body.name === "string" ? normalizeBrokerName(body.name) : null;
  const phone = typeof body.phone === "string" ? normalizeWhatsApp(body.phone) : null;
  if (!name) return NextResponse.json({ error: "Informe seu nome (2 a 60 caracteres)." }, { status: 400, headers: NO_STORE });
  if (!phone) return NextResponse.json({ error: "Informe um WhatsApp brasileiro com DDD." }, { status: 400, headers: NO_STORE });

  // Lançamento: só os que aparecem na vitrine (pins do mapa dos corretores).
  let projectId: string | null = null;
  if (typeof body.projectId === "string" && body.projectId) {
    const materialUrls = new Set((materials as { url: string }[]).map((item) => item.url));
    const project = (catalog as unknown as { id: string }[]).find((p) => p.id === body.projectId);
    if (!project || !isMapEligible(project as never, materialUrls)) {
      return NextResponse.json({ error: "Este lançamento não está na versão para clientes." }, { status: 400, headers: NO_STORE });
    }
    projectId = project.id;
  }

  const token = await createBrokerToken({ name, phone }, linkSecret);
  const longUrl = new URL(vitrinePath({ t: token, p: projectId }), request.url).toString();
  const store = storeFromEnv();
  if (!store) {
    return NextResponse.json({ url: longUrl, longUrl, short: false, notice: "Links curtos ainda não configurados: este é o link completo, que funciona normalmente.", name, phone, projectId }, { headers: NO_STORE });
  }
  try {
    const code = await createShortLink(store, token, projectId);
    return NextResponse.json({ url: new URL(`/c/${code}`, request.url).toString(), longUrl, short: true, name, phone, projectId }, { headers: NO_STORE });
  } catch {
    return NextResponse.json({ url: longUrl, longUrl, short: false, notice: "Não foi possível gerar o link curto agora: este é o link completo, que funciona normalmente.", name, phone, projectId }, { headers: NO_STORE });
  }
}
