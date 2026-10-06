import { NextRequest, NextResponse } from "next/server";
import { isValidSiteSession } from "@/lib/site-auth";

const json = (body: Record<string, unknown>, status = 200) =>
  NextResponse.json(body, { status });

export async function POST(request: NextRequest) {
  const secret = process.env.SITE_SESSION_SECRET;
  const session = request.cookies.get("spinmap_session")?.value;
  if (!secret || !(await isValidSiteSession(session, secret))) {
    return json({ error: "Sua sessão expirou. Entre novamente no mapa." }, 401);
  }

  const recipient = process.env.REPORT_TO_EMAIL?.trim();
  if (!recipient) {
    return json({ error: "O envio por e-mail ainda não foi configurado." }, 503);
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Não foi possível ler o reporte." }, 400);
  }

  const clean = (value: unknown, max: number) =>
    typeof value === "string" ? value.trim().slice(0, max) : "";
  const name = clean(body.name, 120);
  const neighborhood = clean(body.neighborhood, 100);
  const address = clean(body.address, 250);
  const issue = clean(body.issue, 2000);
  if (!name || !issue) {
    return json({ error: "Informe o lançamento e descreva o problema." }, 400);
  }

  const message = [
    "Reporte do Mapa de Lançamentos SPIN Niterói",
    `Empreendimento: ${name}`,
    `Bairro: ${neighborhood || "não informado"}`,
    `Endereço exibido: ${address || "não informado"}`,
    "",
    "Problema ou correção:",
    issue,
  ].join("\n");

  try {
    const upstream = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipient)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: "Mapa de Lançamentos SPIN Niterói",
        message,
        _subject: `Reporte no mapa: ${name}`,
        _template: "table",
        _honey: "",
      }),
    });
    const result = await upstream.json().catch(() => ({})) as { success?: boolean | string; message?: string };
    if (!upstream.ok || result.success === false || result.success === "false") {
      return json({ error: "O serviço de e-mail não aceitou o reporte. Tente novamente." }, 502);
    }
    return json({ ok: true });
  } catch {
    return json({ error: "Não foi possível conectar ao serviço de e-mail." }, 502);
  }
}
