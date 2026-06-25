import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { TurmaComContagem, TurmasRepository } from './turmas.repository';

@Injectable()
export class PrismaTurmasRepository implements TurmasRepository {
  constructor(private readonly prisma: PrismaService) {}

  private readonly include = {
    _count: { select: { alunos: true } },
  } satisfies Prisma.TurmaInclude;

  create(data: Prisma.TurmaCreateInput): Promise<TurmaComContagem> {
    return this.prisma.turma.create({ data, include: this.include });
  }

  findAll(): Promise<TurmaComContagem[]> {
    return this.prisma.turma.findMany({
      include: this.include,
      orderBy: { nome: 'asc' },
    });
  }

  findById(id: string): Promise<TurmaComContagem | null> {
    return this.prisma.turma.findUnique({
      where: { id },
      include: this.include,
    });
  }

  update(id: string, data: Prisma.TurmaUpdateInput): Promise<TurmaComContagem> {
    return this.prisma.turma.update({
      where: { id },
      data,
      include: this.include,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.turma.delete({ where: { id } });
  }
}
