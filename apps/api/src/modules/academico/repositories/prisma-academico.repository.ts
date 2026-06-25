import { Injectable } from '@nestjs/common';
import { SituacaoAluno, Turma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  AcademicoRepository,
  AlunoComDesempenho,
} from './academico.repository';

@Injectable()
export class PrismaAcademicoRepository implements AcademicoRepository {
  constructor(private readonly prisma: PrismaService) {}

  private readonly includeDesempenho = {
    turma: true,
    notas: { include: { disciplina: true } },
    frequencias: { include: { disciplina: true } },
  };

  buscarAlunoComDesempenho(
    alunoId: string,
  ): Promise<AlunoComDesempenho | null> {
    return this.prisma.aluno.findUnique({
      where: { id: alunoId },
      include: this.includeDesempenho,
    }) as Promise<AlunoComDesempenho | null>;
  }

  buscarAlunosDaTurmaComDesempenho(
    turmaId: string,
  ): Promise<AlunoComDesempenho[]> {
    return this.prisma.aluno.findMany({
      where: { turmaId },
      include: this.includeDesempenho,
      orderBy: { nome: 'asc' },
    }) as Promise<AlunoComDesempenho[]>;
  }

  buscarTurma(turmaId: string): Promise<Turma | null> {
    return this.prisma.turma.findUnique({ where: { id: turmaId } });
  }

  async buscarTurmaPorOrdem(
    ordem: number,
    turnoPreferido?: string,
  ): Promise<Turma | null> {
    const turmas = await this.prisma.turma.findMany({ where: { ordem } });
    if (turmas.length === 0) return null;
    return (
      turmas.find((t) => t.turno === turnoPreferido) ?? turmas[0]
    );
  }

  async atualizarSituacaoETurma(
    alunoId: string,
    dados: { situacao: SituacaoAluno; turmaId?: string },
  ): Promise<void> {
    await this.prisma.aluno.update({
      where: { id: alunoId },
      data: {
        situacao: dados.situacao,
        ...(dados.turmaId ? { turmaId: dados.turmaId } : {}),
      },
    });
  }
}
