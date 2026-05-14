"use client";
import React, { createContext, useContext, ReactNode } from "react";

// Definindo o tipo Professor que o erro reclama na linha 10
export interface Professor {
  id: string;
  nome: string;
  email: string;
  disciplina: string;
}

interface EscolaContextData {
  professores: Professor[];
}

const EscolaContext = createContext<EscolaContextData>({} as EscolaContextData);

export function EscolaProvider({ children }: { children: ReactNode }) {
  // Dados vazios por enquanto só para o build passar
  const professores: Professor[] = [];

  return (
    <EscolaContext.Provider value={{ professores }}>
      {children}
    </EscolaContext.Provider>
  );
}

export const useEscola = () => useContext(EscolaContext);
