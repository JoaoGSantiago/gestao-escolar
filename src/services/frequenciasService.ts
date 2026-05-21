import { frequenciaMock, type Frequencia } from "../../mocks/frequencia";
import { simularRespostaApi } from "./api";

export type { Frequencia };

export function listarFrequencias() {
  return simularRespostaApi(frequenciaMock);
}
