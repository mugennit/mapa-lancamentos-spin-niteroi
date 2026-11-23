import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./experience.css";

export const metadata: Metadata = {
  title: "Mapa de lançamentos | Spin Niterói",
  description: "Mapa interno de empreendimentos de Niterói. Books e tabelas dos materiais Spin.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/icons/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Lançamentos SPIN", statusBarStyle: "default" },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#132a43" };

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
