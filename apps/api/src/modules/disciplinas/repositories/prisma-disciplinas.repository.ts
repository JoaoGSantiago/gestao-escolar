import { Injectable } from '@nestjs/common';
import { Disciplina, Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { DisciplinasRepository } from './disciplinas.repository';

@Injectable()
export class PrismaDisciplinasRepository implements DisciplinasRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.DisciplinaCreateInput): Promise<Disciplina> {
    return this.prisma.disciplina.create({ data });
  }

  findAll(): Promise<Disciplina[]> {
    return this.prisma.disciplina.findMany({ orderBy: { nome: 'asc' } });
  }

  findById(id: string): Promise<Disciplina | null> {
    return this.prisma.disciplina.findUnique({ where: { id } });
  }

  update(id: string, data: Prisma.DisciplinaUpdateInput): Promise<Disciplina> {
    return this.prisma.disciplina.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.disciplina.delete({ where: { id } });
  }
}
