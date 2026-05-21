import { disciplinasMock, type Disciplina } from "../../mocks/disciplinas";
import { simularRespostaApi } from "./api";

export type { Disciplina };

export function listarDisciplinas() {
  return simularRespostaApi(disciplinasMock);
}
