import { Injectable } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  ProfessorComDisciplinas,
  ProfessoresRepository,
} from './professores.repository';

@Injectable()
export class PrismaProfessoresRepository implements ProfessoresRepository {
  constructor(private readonly prisma: PrismaService) {}

  private readonly include = {
    disciplinas: true,
    user: true,
  } satisfies Prisma.ProfessorInclude;

  create(data: Prisma.ProfessorCreateInput): Promise<ProfessorComDisciplinas> {
    return this.prisma.professor.create({ data, include: this.include });
  }

  findAll(): Promise<ProfessorComDisciplinas[]> {
    return this.prisma.professor.findMany({
      include: this.include,
      orderBy: { nome: 'asc' },
    });
  }

  findById(id: string): Promise<ProfessorComDisciplinas | null> {
    return this.prisma.professor.findUnique({
      where: { id },
      include: this.include,
    });
  }

  update(
    id: string,
    data: Prisma.ProfessorUpdateInput,
  ): Promise<ProfessorComDisciplinas> {
    return this.prisma.professor.update({
      where: { id },
      data,
      include: this.include,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.professor.delete({ where: { id } });
  }

  async criarAcesso(dados: {
    nome: string;
    email: string;
    senhaHash: string;
    professorId: string;
  }): Promise<void> {
    await this.prisma.user.create({
      data: {
        nome: dados.nome,
        email: dados.email,
        senhaHash: dados.senhaHash,
        role: Role.PROFESSOR,
        professorId: dados.professorId,
      },
    });
  }
}
