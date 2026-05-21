import { turmasMock, type Turma } from "../../mocks/turmas";
import { simularRespostaApi } from "./api";

export type { Turma };

export function listarTurmas() {
  return simularRespostaApi(turmasMock);
}
