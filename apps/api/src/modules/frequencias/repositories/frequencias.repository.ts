import { Frequencia, Prisma } from '@prisma/client';

export abstract class FrequenciasRepository {
  abstract findAll(filtro?: {
    alunoId?: string;
    disciplinaId?: string;
  }): Promise<Frequencia[]>;
  abstract findById(id: string): Promise<Frequencia | null>;
  abstract findByAlunoDisciplina(
    alunoId: string,
    disciplinaId: string,
  ): Promise<Frequencia | null>;
  abstract create(data: Prisma.FrequenciaCreateInput): Promise<Frequencia>;
  abstract update(
    id: string,
    data: Prisma.FrequenciaUpdateInput,
  ): Promise<Frequencia>;
  abstract delete(id: string): Promise<void>;
}

export const FREQUENCIAS_REPOSITORY = 'FREQUENCIAS_REPOSITORY';
