"use client";

import { useState } from "react";

export default function LoginForm({ erro }: { erro: boolean }) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <form action="/api/auth" method="post" className="login-form">
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
