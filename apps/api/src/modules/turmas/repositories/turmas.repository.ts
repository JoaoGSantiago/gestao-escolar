import { Prisma, Turma } from '@prisma/client';

/** Turma com a contagem de alunos agregada. */
export type TurmaComContagem = Turma & { _count: { alunos: number } };

/**
 * Contrato de acesso a dados de Turmas (Repository Pattern).
 */
export abstract class TurmasRepository {
  abstract create(data: Prisma.TurmaCreateInput): Promise<TurmaComContagem>;
  abstract findAll(): Promise<TurmaComContagem[]>;
  abstract findById(id: string): Promise<TurmaComContagem | null>;
  abstract update(
    id: string,
    data: Prisma.TurmaUpdateInput,
  ): Promise<TurmaComContagem>;
  abstract delete(id: string): Promise<void>;
}

export const TURMAS_REPOSITORY = 'TURMAS_REPOSITORY';
