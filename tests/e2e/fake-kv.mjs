// Banco de links FICTÍCIO para testes: imita a API REST do Upstash Redis
// (comandos GET e SET [NX]) em memória, gravando num arquivo para sobreviver a
// reinícios do simulador (como uma nova publicação). Nunca usado em produção.
//   KV_PORT=4199 KV_REST_API_TOKEN=token-de-teste node tests/e2e/fake-kv.mjs
import http from "node:http";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const port = Number(process.env.KV_PORT || 4199);
const token = process.env.KV_REST_API_TOKEN || "token-de-teste";
const file = process.env.FAKE_KV_FILE || "";
const data = new Map(file && existsSync(file) ? Object.entries(JSON.parse(readFileSync(file, "utf8"))) : []);
const save = () => { if (file) writeFileSync(file, JSON.stringify(Object.fromEntries(data))); };

http.createServer((request, response) => {
  const send = (status, body) => { response.writeHead(status, { "content-type": "application/json" }); response.end(JSON.stringify(body)); };
  if (request.headers.authorization !== `Bearer ${token}`) return send(401, { error: "Unauthorized" });
  let body = "";
  request.on("data", (chunk) => { body += chunk; });
  request.on("end", () => {
    let args;
    try { args = JSON.parse(body); } catch { return send(400, { error: "JSON inválido" }); }
    const [command, key, value, flag] = Array.isArray(args) ? args.map(String) : [];
    if (command?.toUpperCase() === "GET") return send(200, { result: data.has(key) ? data.get(key) : null });
    if (command?.toUpperCase() === "SET") {
      if (flag?.toUpperCase() === "NX" && data.has(key)) return send(200, { result: null });
      data.set(key, value); save();
      return send(200, { result: "OK" });
    }
    send(400, { error: `comando não suportado: ${command}` });
  });
}).listen(port, () => console.log(`banco de links fictício em http://localhost:${port}`));
