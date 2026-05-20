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
    turma: "6º Ano A",
    turmaId: "TUR001",
  },
  {
    id: "ALU002",
    nome: "Marcelo Henrique",
    email: "mhbl3@aluno.ifal.edu.br",
    turma: "6º Ano A",
    turmaId: "TUR001",
  },
  {
    id: "ALU003",
    nome: "Helder Vinícius",
    email: "hvsln3@aluno.ifal.edu.br",
    turma: "6º Ano A",
    turmaId: "TUR001",
  },
  {
    id: "ALU004",
    nome: "Ana Beatriz",
    email: "abso2@aluno.ifal.edu.br",
    turma: "7º Ano B",
    turmaId: "TUR002",
  },
  {
    id: "ALU005",
    nome: "Carlos Eduardo",
    email: "cefs1@aluno.ifal.edu.br",
    turma: "7º Ano B",
    turmaId: "TUR002",
  },
  {
    id: "ALU006",
    nome: "Marina Lima",
    email: "mlca4@aluno.ifal.edu.br",
    turma: "1º Médio C",
    turmaId: "TUR003",
  },
];
