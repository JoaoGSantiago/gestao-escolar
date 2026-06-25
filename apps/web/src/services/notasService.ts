import { type Nota } from "../../mocks/notas";
import { apiFetch } from "./api";

export type { Nota };

export function listarNotas() {
  return apiFetch<Nota[]>("/notas");
}

export type RegistrarNotaInput = {
  alunoId: string;
  disciplinaId: string;
  avaliacao: string;
  valor: number;
  bimestre: number;
};

export function registrarNota(input: RegistrarNotaInput) {
  return apiFetch<Nota>("/notas", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
