import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "../../components/Providers";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
