import type { Metadata } from "next";
import "./globals.css";
import Providers from "../../components/Providers";

export const metadata: Metadata = {
  title: "EduGestão - Sistema Escolar",
  description: "Projeto de gestão escolar para disciplina de Programação Web",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body className="font-sans" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
