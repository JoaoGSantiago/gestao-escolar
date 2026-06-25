import { Disciplina, Prisma } from '@prisma/client';

export abstract class DisciplinasRepository {
  abstract create(data: Prisma.DisciplinaCreateInput): Promise<Disciplina>;
  abstract findAll(): Promise<Disciplina[]>;
  abstract findById(id: string): Promise<Disciplina | null>;
  abstract update(
    id: string,
    data: Prisma.DisciplinaUpdateInput,
  ): Promise<Disciplina>;
  abstract delete(id: string): Promise<void>;
}

export const DISCIPLINAS_REPOSITORY = 'DISCIPLINAS_REPOSITORY';
