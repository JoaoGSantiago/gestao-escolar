import { professoresMock, type Professor } from "../../mocks/professores";
import { simularRespostaApi } from "./api";

export type { Professor };

export function listarProfessores() {
  return simularRespostaApi(professoresMock);
}
