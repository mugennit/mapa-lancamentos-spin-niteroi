import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mapa de lançamentos | Spin Niterói",
  description: "Mapa interno de empreendimentos de Niterói. Books e tabelas dos materiais Spin.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
