// Link de divulgação do corretor: nome + WhatsApp assinados no servidor (HMAC).
// Só links gerados pela área interna (protegida pela senha) são aceitos, o que
// impede que alguém crie um link com outro nome ou número.
// Sem dependências; usa Web Crypto (disponível no Node e nos servidores).

const encoder = new TextEncoder();
const PREFIX = "spin-broker-v1:";

export type Broker = { name: string; phone: string };

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(text: string): Uint8Array | null {
  if (!/^[A-Za-z0-9_-]*$/.test(text)) return null;
  try {
    const binary = atob(text.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((text.length + 3) % 4));
    return Uint8Array.from(binary, (char) => char.charCodeAt(0));
  } catch { return null; }
}

async function sign(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return toBase64Url(new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(PREFIX + payload))));
}

/** Telefone brasileiro em formato internacional só com dígitos (55 + DDD + número), ou null. */
export function normalizeWhatsApp(input: string): string | null {
  const international = /^\s*(\+|00)/.test(input);
  let digits = input.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  // Número com código de outro país não é aceito (o link é para o Brasil).
  if (international && !digits.startsWith("55")) return null;
  if (!international && (digits.length === 10 || digits.length === 11)) digits = `55${digits}`;
  if (!digits.startsWith("55") || (digits.length !== 12 && digits.length !== 13)) return null;
  const ddd = Number(digits.slice(2, 4));
  if (ddd < 11 || ddd > 99) return null;
  return digits;
}

/** Nome exibido do corretor: 2 a 60 caracteres, sem quebras de linha. */
export function normalizeBrokerName(input: string): string | null {
  const name = input.replace(/\s+/g, " ").trim();
  return name.length >= 2 && name.length <= 60 && !/[<>]/.test(name) ? name : null;
}

export async function createBrokerToken(broker: Broker, secret: string): Promise<string> {
  const name = normalizeBrokerName(broker.name), phone = normalizeWhatsApp(broker.phone);
  if (!name || !phone) throw new Error("Nome ou WhatsApp inválido.");
  if (!secret) throw new Error("Segredo ausente.");
  const payload = toBase64Url(encoder.encode(JSON.stringify({ n: name, w: phone })));
  return `${payload}.${await sign(payload, secret)}`;
}

export async function verifyBrokerToken(token: string | null | undefined, secret: string | undefined): Promise<Broker | null> {
  if (!token || !secret || token.length > 600) return null;
  const [payload, signature, ...extra] = token.split(".");
  if (!payload || !signature || extra.length) return null;
  const expected = await sign(payload, secret);
  let difference = expected.length ^ signature.length;
  for (let i = 0; i < Math.max(expected.length, signature.length); i++) difference |= (expected.charCodeAt(i) || 0) ^ (signature.charCodeAt(i) || 0);
  if (difference !== 0) return null;
  const bytes = fromBase64Url(payload);
  if (!bytes) return null;
  try {
    const data = JSON.parse(new TextDecoder().decode(bytes)) as { n?: unknown; w?: unknown };
    const name = typeof data.n === "string" ? normalizeBrokerName(data.n) : null;
    const phone = typeof data.w === "string" ? normalizeWhatsApp(data.w) : null;
    return name && phone ? { name, phone } : null;
  } catch { return null; }
}

/** Mensagem pré-preenchida para o WhatsApp, identificando o empreendimento. */
export function whatsappUrl(phone: string, project: { name: string; neighborhood?: string }, brokerName?: string | null): string {
  const place = project.neighborhood ? ` (${project.neighborhood}, Niterói)` : " (Niterói)";
  const greeting = brokerName ? `Olá, ${brokerName.split(" ")[0]}!` : "Olá!";
  const text = `${greeting} Vi o empreendimento ${project.name}${place} no mapa de lançamentos da SPIN e gostaria de consultar valores e disponibilidade.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
