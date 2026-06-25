import { Aluno, Prisma, Turma } from '@prisma/client';

/** Aluno com a turma carregada. */
export type AlunoComTurma = Aluno & { turma: Turma };

export abstract class AlunosRepository {
  abstract create(data: Prisma.AlunoCreateInput): Promise<AlunoComTurma>;
  abstract findAll(): Promise<AlunoComTurma[]>;
  abstract findById(id: string): Promise<AlunoComTurma | null>;
  abstract findByTurma(turmaId: string): Promise<AlunoComTurma[]>;
  abstract update(
    id: string,
    data: Prisma.AlunoUpdateInput,
  ): Promise<AlunoComTurma>;
  abstract delete(id: string): Promise<void>;
}

export const ALUNOS_REPOSITORY = 'ALUNOS_REPOSITORY';
