import { useContext } from "react";
import { EscolaContext } from "./EscolaContextCore";

export function useEscola() {
  const context = useContext(EscolaContext);

  if (!context) {
    throw new Error("useEscola deve ser usado dentro de EscolaProvider.");
  }

  return context;
}
