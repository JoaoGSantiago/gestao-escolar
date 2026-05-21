import { alunosMock, type Aluno } from "../../mocks/alunos";
import { simularRespostaApi } from "./api";

export type { Aluno };

export function listarAlunos() {
  return simularRespostaApi(alunosMock);
}
