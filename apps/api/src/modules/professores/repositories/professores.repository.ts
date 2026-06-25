import { Disciplina, Prisma, Professor, User } from '@prisma/client';

/** Professor com suas disciplinas e o eventual usuário de acesso. */
export type ProfessorComDisciplinas = Professor & {
  disciplinas: Disciplina[];
  user?: User | null;
};

export abstract class ProfessoresRepository {
  abstract create(
    data: Prisma.ProfessorCreateInput,
  ): Promise<ProfessorComDisciplinas>;
  abstract findAll(): Promise<ProfessorComDisciplinas[]>;
  abstract findById(id: string): Promise<ProfessorComDisciplinas | null>;
  abstract update(
    id: string,
    data: Prisma.ProfessorUpdateInput,
  ): Promise<ProfessorComDisciplinas>;
  abstract delete(id: string): Promise<void>;
  /** Cria o usuário de acesso (login) vinculado a um professor. */
  abstract criarAcesso(dados: {
    nome: string;
    email: string;
    senhaHash: string;
    professorId: string;
  }): Promise<void>;
}

export const PROFESSORES_REPOSITORY = 'PROFESSORES_REPOSITORY';
