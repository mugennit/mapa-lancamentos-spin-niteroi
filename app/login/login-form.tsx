"use client";

import { useState } from "react";
import { SHARE_KEY } from "@/lib/project-search";

export default function LoginForm({ erro }: { erro: boolean }) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <form action="/api/auth" method="post" className="login-form" onSubmit={() => {try {const selection = new URLSearchParams(window.location.hash.slice(1)).get('selecao');if (selection) sessionStorage.setItem(SHARE_KEY, JSON.stringify(selection.split(',').slice(0,3)));} catch {}}}>
      <label htmlFor="site-password">Senha</label>
      <div className="password-field">
        <input
          id="site-password"
          name="password"
          type={passwordVisible ? "text" : "password"}
          autoComplete="current-password"
          autoFocus
          aria-describedby={erro ? "site-password-error" : undefined}
          required
        />
        <button
          type="button"
          className="password-toggle"
          aria-controls="site-password"
          aria-label={passwordVisible ? "Ocultar senha" : "Mostrar senha"}
          aria-pressed={passwordVisible}
          onClick={() => setPasswordVisible((visible) => !visible)}
        >
          {passwordVisible ? "Ocultar" : "Mostrar"}
        </button>
      </div>
      {erro && <p id="site-password-error" className="login-error" role="alert">Senha incorreta. Tente novamente.</p>}
      <button className="login-submit" type="submit">Entrar</button>
    </form>
  );
}
