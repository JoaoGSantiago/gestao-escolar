export interface Aluno {
  id: string;
  nome: string;
  email: string;
  turma: string;
}

export const alunosMock: Aluno[] = [
  {
    id: "1",
    nome: "João Gustavo",
    email: "jgsl8@aluno.ifal.edu.br",
    turma: "5º Período",
  },
  {
    id: "2",
    nome: "Marcelo Henrique",
    email: "mhbl3@aluno.ifal.edu.br",
    turma: "5º Período",
  },
  {
    id: "3",
    nome: "Helder Vinícius",
    email: "hvsln3@aluno.ifal.edu.br",
    turma: "5º Período",
  },
];
