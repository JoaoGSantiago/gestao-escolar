import {
  Aluno,
  Disciplina,
  Frequencia,
  Nota,
  SituacaoAluno,
  Turma,
} from '@prisma/client';

/** Aluno com tudo que é necessário para montar o boletim. */
export type AlunoComDesempenho = Aluno & {
  turma: Turma;
  notas: (Nota & { disciplina: Disciplina })[];
  frequencias: (Frequencia & { disciplina: Disciplina })[];
};

export abstract class AcademicoRepository {
  abstract buscarAlunoComDesempenho(
    alunoId: string,
  ): Promise<AlunoComDesempenho | null>;

  abstract buscarAlunosDaTurmaComDesempenho(
    turmaId: string,
  ): Promise<AlunoComDesempenho[]>;

  abstract buscarTurma(turmaId: string): Promise<Turma | null>;

  /** Turma de destino para promoção (série seguinte), preferindo o mesmo turno. */
  abstract buscarTurmaPorOrdem(
    ordem: number,
    turnoPreferido?: string,
  ): Promise<Turma | null>;

  abstract atualizarSituacaoETurma(
    alunoId: string,
    dados: { situacao: SituacaoAluno; turmaId?: string },
  ): Promise<void>;
}

export const ACADEMICO_REPOSITORY = 'ACADEMICO_REPOSITORY';
