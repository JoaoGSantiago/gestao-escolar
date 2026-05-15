"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { EscolaProvider } from "../src/contexts/EscolaContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  // Criamos o QueryClient dentro de um state para evitar que ele seja reiniciado em cada render
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <EscolaProvider>
        {children}
        <ToastContainer position="top-right" autoClose={3000} />
      </EscolaProvider>
    </QueryClientProvider>
  );
}
