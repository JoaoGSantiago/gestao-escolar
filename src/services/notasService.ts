import { notasMock, type Nota } from "../../mocks/notas";
import { simularRespostaApi } from "./api";

export type { Nota };

export function listarNotas() {
  return simularRespostaApi(notasMock);
}
