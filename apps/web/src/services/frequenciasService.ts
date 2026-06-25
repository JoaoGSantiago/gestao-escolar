import { type Frequencia } from "../../mocks/frequencia";
import { apiFetch } from "./api";

export type { Frequencia };

export function listarFrequencias() {
  return apiFetch<Frequencia[]>("/frequencias");
}

export type RegistrarFrequenciaInput = {
  alunoId: string;
  disciplinaId: string;
  aulasPrevistas?: number;
  presencas: number;
  faltas: number;
};

export function registrarFrequencia(input: RegistrarFrequenciaInput) {
  return apiFetch<Frequencia>("/frequencias", {
    method: "PUT",
    body: JSON.stringify(input),
  });
}
