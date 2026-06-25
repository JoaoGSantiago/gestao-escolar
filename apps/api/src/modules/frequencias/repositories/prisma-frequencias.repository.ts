import { Injectable } from '@nestjs/common';
import { Frequencia, Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { FrequenciasRepository } from './frequencias.repository';

@Injectable()
export class PrismaFrequenciasRepository implements FrequenciasRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(filtro?: {
    alunoId?: string;
    disciplinaId?: string;
  }): Promise<Frequencia[]> {
    return this.prisma.frequencia.findMany({
      where: {
        alunoId: filtro?.alunoId,
        disciplinaId: filtro?.disciplinaId,
      },
      orderBy: { alunoId: 'asc' },
    });
  }

  findById(id: string): Promise<Frequencia | null> {
    return this.prisma.frequencia.findUnique({ where: { id } });
  }

  findByAlunoDisciplina(
    alunoId: string,
    disciplinaId: string,
  ): Promise<Frequencia | null> {
    return this.prisma.frequencia.findUnique({
      where: { alunoId_disciplinaId: { alunoId, disciplinaId } },
    });
  }

  create(data: Prisma.FrequenciaCreateInput): Promise<Frequencia> {
    return this.prisma.frequencia.create({ data });
  }

  update(id: string, data: Prisma.FrequenciaUpdateInput): Promise<Frequencia> {
    return this.prisma.frequencia.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.frequencia.delete({ where: { id } });
  }
}
