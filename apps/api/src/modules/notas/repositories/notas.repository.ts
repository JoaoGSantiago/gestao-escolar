import { Nota, Prisma } from '@prisma/client';

/** Chave natural que identifica unicamente uma nota. */
export interface NotaChave {
  alunoId: string;
  disciplinaId: string;
  avaliacao: string;
  bimestre: number;
}

export abstract class NotasRepository {
  abstract findAll(filtro?: {
    alunoId?: string;
    disciplinaId?: string;
  }): Promise<Nota[]>;
  abstract findById(id: string): Promise<Nota | null>;
  abstract findByChave(chave: NotaChave): Promise<Nota | null>;
  abstract create(data: Prisma.NotaCreateInput): Promise<Nota>;
  abstract update(id: string, data: Prisma.NotaUpdateInput): Promise<Nota>;
  abstract delete(id: string): Promise<void>;
}

export const NOTAS_REPOSITORY = 'NOTAS_REPOSITORY';
