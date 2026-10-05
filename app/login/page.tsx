type LoginPageProps = { searchParams: Promise<{ erro?: string }> };

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { erro } = await searchParams;
  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <span className="login-brand">spin</span>
        <p className="login-eyebrow">Acesso da equipe</p>
        <h1 id="login-title">Mapa de empreendimentos</h1>
        <p className="login-intro">Digite a senha compartilhada para consultar os lançamentos.</p>
        <form action="/api/auth" method="post" className="login-form">
          <label htmlFor="site-password">Senha</label>
          <input id="site-password" name="password" type="password" autoComplete="current-password" autoFocus required />
          {erro && <p className="login-error" role="alert">Senha incorreta. Tente novamente.</p>}
          <button type="submit">Entrar</button>
        </form>
      </section>
    </main>
  );
}
