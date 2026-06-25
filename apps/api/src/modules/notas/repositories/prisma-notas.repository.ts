import { Injectable } from '@nestjs/common';
import { Nota, Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { NotaChave, NotasRepository } from './notas.repository';

@Injectable()
export class PrismaNotasRepository implements NotasRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(filtro?: {
    alunoId?: string;
    disciplinaId?: string;
  }): Promise<Nota[]> {
    return this.prisma.nota.findMany({
      where: {
        alunoId: filtro?.alunoId,
        disciplinaId: filtro?.disciplinaId,
      },
      orderBy: [{ alunoId: 'asc' }, { avaliacao: 'asc' }],
    });
  }

  findById(id: string): Promise<Nota | null> {
    return this.prisma.nota.findUnique({ where: { id } });
  }

  findByChave(chave: NotaChave): Promise<Nota | null> {
    return this.prisma.nota.findUnique({
      where: {
        alunoId_disciplinaId_avaliacao_bimestre: {
          alunoId: chave.alunoId,
          disciplinaId: chave.disciplinaId,
          avaliacao: chave.avaliacao,
          bimestre: chave.bimestre,
        },
      },
    });
  }

  create(data: Prisma.NotaCreateInput): Promise<Nota> {
    return this.prisma.nota.create({ data });
  }

  update(id: string, data: Prisma.NotaUpdateInput): Promise<Nota> {
    return this.prisma.nota.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.nota.delete({ where: { id } });
  }
}
