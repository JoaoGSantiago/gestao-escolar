export interface Aluno {
  id: string;
  nome: string;
  email: string;
  turma: string;
  turmaId: string;
}

export const alunosMock: Aluno[] = [
  {
    id: "ALU001",
    nome: "João Gustavo",
    email: "jgsl8@aluno.ifal.edu.br",
    turma: "6º Ano",
    turmaId: "TUR001",
  },
  {
    id: "ALU002",
    nome: "Marcelo Henrique",
    email: "mhbl3@aluno.ifal.edu.br",
    turma: "6º Ano",
    turmaId: "TUR001",
  },
  {
    id: "ALU003",
    nome: "Helder Vinícius",
    email: "hvsln3@aluno.ifal.edu.br",
    turma: "6º Ano",
    turmaId: "TUR001",
  },
  {
    id: "ALU004",
    nome: "Ana Beatriz",
    email: "abso2@aluno.ifal.edu.br",
    turma: "7º Ano",
    turmaId: "TUR002",
  },
  {
    id: "ALU005",
    nome: "Carlos Eduardo",
    email: "cefs1@aluno.ifal.edu.br",
    turma: "7º Ano",
    turmaId: "TUR002",
  },
  {
    id: "ALU006",
    nome: "Marina Lima",
    email: "mlca4@aluno.ifal.edu.br",
    turma: "1º Médio",
    turmaId: "TUR003",
  },
  {
    id: "ALU007",
    nome: "Lucas Ferreira",
    email: "lfs7@aluno.ifal.edu.br",
    turma: "1º Médio",
    turmaId: "TUR003",
  },
  {
    id: "ALU008",
    nome: "Bianca Rocha",
    email: "brma8@aluno.ifal.edu.br",
    turma: "1º Médio",
    turmaId: "TUR003",
  },
  {
    id: "ALU009",
    nome: "Rafael Martins",
    email: "rmso9@aluno.ifal.edu.br",
    turma: "1º Médio",
    turmaId: "TUR003",
  },
];
