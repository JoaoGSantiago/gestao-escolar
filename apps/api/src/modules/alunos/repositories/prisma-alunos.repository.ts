import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { AlunoComTurma, AlunosRepository } from './alunos.repository';

@Injectable()
export class PrismaAlunosRepository implements AlunosRepository {
  constructor(private readonly prisma: PrismaService) {}

  private readonly include = { turma: true } satisfies Prisma.AlunoInclude;

  create(data: Prisma.AlunoCreateInput): Promise<AlunoComTurma> {
    return this.prisma.aluno.create({ data, include: this.include });
  }

  findAll(): Promise<AlunoComTurma[]> {
    return this.prisma.aluno.findMany({
      include: this.include,
      orderBy: { nome: 'asc' },
    });
  }

  findById(id: string): Promise<AlunoComTurma | null> {
    return this.prisma.aluno.findUnique({
      where: { id },
      include: this.include,
    });
  }

  findByTurma(turmaId: string): Promise<AlunoComTurma[]> {
    return this.prisma.aluno.findMany({
      where: { turmaId },
      include: this.include,
      orderBy: { nome: 'asc' },
    });
  }

  update(id: string, data: Prisma.AlunoUpdateInput): Promise<AlunoComTurma> {
    return this.prisma.aluno.update({
      where: { id },
      data,
      include: this.include,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.aluno.delete({ where: { id } });
  }
}
