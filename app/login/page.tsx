import LoginForm from "./login-form";

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
        <LoginForm erro={Boolean(erro)} />
      </section>
    </main>
  );
}
