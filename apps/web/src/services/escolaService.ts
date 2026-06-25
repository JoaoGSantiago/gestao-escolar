import { listarAlunos } from "./alunosService";
import { listarDisciplinas } from "./disciplinasService";
import { listarFrequencias } from "./frequenciasService";
import { listarNotas } from "./notasService";
import { listarProfessores } from "./professoresService";
import { listarTurmas } from "./turmasService";

export async function buscarDadosEscola() {
  const [alunos, professores, turmas, disciplinas, frequencias, notas] =
    await Promise.all([
      listarAlunos(),
      listarProfessores(),
      listarTurmas(),
      listarDisciplinas(),
      listarFrequencias(),
      listarNotas(),
    ]);

  return {
    alunos,
    professores,
    turmas,
    disciplinas,
    frequencias,
    notas,
  };
}
