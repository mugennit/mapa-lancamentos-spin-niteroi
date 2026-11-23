// Simula a Vercel para testar o build de produção (VERCEL=1 npx vite build):
// arquivos de .vercel/output/static são servidos direto (como na CDN, sem passar
// pelo proxy.ts) e o restante vai para a função do servidor.
//   PORT=4181 node tests/e2e/vercel-sim.mjs
import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../.vercel/output");
const port = Number(process.env.PORT || 4181);
const handler = (await import(path.join(root, "functions/__server.func/index.mjs"))).default;
const types = { ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".jpg": "image/jpeg", ".png": "image/png", ".json": "application/json", ".webmanifest": "application/manifest+json", ".html": "text/html" };

http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`);
  const file = path.join(root, "static", decodeURIComponent(url.pathname));
  if (file.startsWith(path.join(root, "static"))) {
    try {
      if ((await stat(file)).isFile()) {
        res.writeHead(200, { "content-type": types[path.extname(file)] || "application/octet-stream" });
        res.end(await readFile(file));
        return;
      }
    } catch {}
  }
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const request = new Request(url, { method: req.method, headers: req.headers, body: ["GET", "HEAD"].includes(req.method) ? undefined : Buffer.concat(chunks), redirect: "manual" });
  const response = await handler.fetch(request, {});
  const headers = {};
  response.headers.forEach((value, key) => { headers[key] = key === "set-cookie" ? response.headers.getSetCookie() : value; });
  res.writeHead(response.status, headers);
  res.end(Buffer.from(await response.arrayBuffer()));
}).listen(port, () => console.log(`simulador da Vercel em http://localhost:${port}`));
