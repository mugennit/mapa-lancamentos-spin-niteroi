// Links curtos para clientes (/c/Ab7x2k), gerados pelo próprio site.
//
// Cada código guarda, de forma persistente, o token ASSINADO do corretor (o
// mesmo dos links longos, `lib/broker-link.ts`) e o lançamento selecionado.
// A vitrine continua verificando a assinatura com BROKER_LINK_SECRET, então um
// registro adulterado no banco não cria um corretor falso.
//
// Persistência: banco chave-valor Redis via API REST (Upstash, integração
// nativa da Vercel). As variáveis KV_REST_API_URL / KV_REST_API_TOKEN (ou
// UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN) são criadas pela
// integração. Sem elas, o site entrega o link longo (que continua válido).
// Sem dependências: usa fetch e Web Crypto.

/** Alfabeto sem caracteres ambíguos (0/O, 1/I/l). */
export const CODE_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
export const CODE_LENGTH = 6;
const CODE_PATTERN = /^[A-Za-z0-9]{4,16}$/;
const KEY = "spin:short:v1:";

export type ShortLinkRecord = {
  v: 1;
  /** Token assinado do corretor (nome + WhatsApp + assinatura HMAC). */
  t: string;
  /** Id do lançamento cujo card abre direto; null = vitrine completa. */
  p: string | null;
  /** Data de criação (ISO). */
  at: string;
};

/** Armazenamento mínimo necessário (permite trocar o banco ou simular nos testes). */
export type ShortLinkStore = {
  get(key: string): Promise<string | null>;
  /** Grava só se a chave ainda não existir; devolve false se já existia. */
  setIfAbsent(key: string, value: string): Promise<boolean>;
  set(key: string, value: string): Promise<void>;
};

export function isValidCode(code: unknown): code is string {
  return typeof code === "string" && CODE_PATTERN.test(code);
}

/** Código aleatório com fonte criptográfica (sem viés: rejeita bytes fora do múltiplo do alfabeto). */
export function randomCode(length = CODE_LENGTH, random: (bytes: Uint8Array) => Uint8Array = (bytes) => crypto.getRandomValues(bytes)): string {
  const limit = 256 - (256 % CODE_ALPHABET.length);
  let code = "";
  while (code.length < length) {
    for (const byte of random(new Uint8Array(length * 2))) {
      if (byte < limit && code.length < length) code += CODE_ALPHABET[byte % CODE_ALPHABET.length];
    }
  }
  return code;
}

async function fingerprint(token: string, projectId: string | null): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${token}|${projectId ?? ""}`));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function parseRecord(raw: string | null): ShortLinkRecord | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as Partial<ShortLinkRecord>;
    if (data.v !== 1 || typeof data.t !== "string" || !data.t) return null;
    return { v: 1, t: data.t, p: typeof data.p === "string" && data.p ? data.p : null, at: typeof data.at === "string" ? data.at : "" };
  } catch { return null; }
}

/**
 * Devolve o código do link curto para este corretor e lançamento. O mesmo
 * corretor e lançamento reaproveitam o código já criado (sem duplicidade);
 * um código novo só é gravado se ainda não existir (gravação condicional),
 * com novas tentativas em caso de colisão. Códigos existentes nunca são
 * sobrescritos.
 */
export async function createShortLink(store: ShortLinkStore, token: string, projectId: string | null, options: { now?: Date; random?: (bytes: Uint8Array) => Uint8Array; attempts?: number } = {}): Promise<string> {
  const reverseKey = `${KEY}rev:${await fingerprint(token, projectId)}`;
  const existing = await store.get(reverseKey);
  if (isValidCode(existing)) {
    const record = parseRecord(await store.get(`${KEY}${existing}`));
    if (record && record.t === token && record.p === projectId) return existing;
  }
  const record: ShortLinkRecord = { v: 1, t: token, p: projectId, at: (options.now ?? new Date()).toISOString() };
  for (let attempt = 0; attempt < (options.attempts ?? 8); attempt++) {
    // Depois de várias colisões seguidas, aumenta o tamanho do código.
    const code = randomCode(CODE_LENGTH + Math.floor(attempt / 3), options.random);
    if (await store.setIfAbsent(`${KEY}${code}`, JSON.stringify(record))) {
      await store.set(reverseKey, code);
      return code;
    }
  }
  throw new Error("Não foi possível gerar um código único.");
}

/** Registro de um código, ou null se o código não existir ou for inválido. */
export async function resolveShortLink(store: ShortLinkStore, code: string): Promise<ShortLinkRecord | null> {
  if (!isValidCode(code)) return null;
  return parseRecord(await store.get(`${KEY}${code}`));
}

/** Endereço da vitrine para um registro: corretor (`c`) e card aberto (`p`). */
export function vitrinePath(record: Pick<ShortLinkRecord, "t" | "p">): string {
  const params = new URLSearchParams({ c: record.t });
  if (record.p) params.set("p", record.p);
  return `/vitrine?${params.toString()}`;
}

// ---------------------------------------------------------------------------
// Banco Redis pela API REST (Upstash)

type Env = Record<string, string | undefined>;

export function storeFromEnv(env: Env = process.env, fetcher: typeof fetch = fetch): ShortLinkStore | null {
  const url = (env.KV_REST_API_URL || env.UPSTASH_REDIS_REST_URL || "").replace(/\/$/, "");
  const token = env.KV_REST_API_TOKEN || env.UPSTASH_REDIS_REST_TOKEN || "";
  if (!/^https?:\/\//.test(url) || !token) return null;
  const command = async (args: string[]): Promise<unknown> => {
    const response = await fetcher(url, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify(args), cache: "no-store", signal: AbortSignal.timeout(8000) });
    const data = (await response.json().catch(() => ({}))) as { result?: unknown; error?: string };
    if (!response.ok || data.error) throw new Error(`Banco de links indisponível (${response.status}).`);
    return data.result ?? null;
  };
  return {
    async get(key) { const result = await command(["GET", key]); return typeof result === "string" ? result : null; },
    async setIfAbsent(key, value) { return (await command(["SET", key, value, "NX"])) === "OK"; },
    async set(key, value) { await command(["SET", key, value]); },
  };
}
