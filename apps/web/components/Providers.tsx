"use client";
import { EscolaProvider } from "../src/contexts/EscolaContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <EscolaProvider>{children}</EscolaProvider>;
}
