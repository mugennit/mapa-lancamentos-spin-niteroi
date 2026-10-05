const encoder = new TextEncoder();

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function sign(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return toBase64Url(new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(payload))));
}

export async function createSiteSession(secret: string, expiresAt: number): Promise<string> {
  const payload = `spin-site-v1:${expiresAt}`;
  return `${expiresAt}.${await sign(payload, secret)}`;
}

export async function isValidSiteSession(token: string | undefined, secret: string): Promise<boolean> {
  if (!token) return false;
  const [expiresText, signature, ...extra] = token.split(".");
  const expiresAt = Number(expiresText);
  if (extra.length || !Number.isSafeInteger(expiresAt) || expiresAt <= Date.now() || !signature) return false;
  const expected = await createSiteSession(secret, expiresAt);
  let difference = token.length ^ expected.length;
  for (let i = 0; i < Math.max(token.length, expected.length); i++) {
    difference |= (token.charCodeAt(i) || 0) ^ (expected.charCodeAt(i) || 0);
  }
  return difference === 0;
}

export function constantTimeTextEqual(left: string, right: string): boolean {
  let difference = left.length ^ right.length;
  for (let i = 0; i < Math.max(left.length, right.length); i++) {
    difference |= (left.charCodeAt(i) || 0) ^ (right.charCodeAt(i) || 0);
  }
  return difference === 0;
}
