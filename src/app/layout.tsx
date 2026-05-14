import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "../../components/Providers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
        <Providers>
          {children}
          <ToastContainer position="bottom-right" theme="colored" />
        </Providers>
      </body>
    </html>
  );
}
