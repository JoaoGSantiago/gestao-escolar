export interface Turma {
  id: string;
  nome: string;
  turno: string;
  alunos: number;
}

export const turmasMock: Turma[] = [
  {
    id: "1",
    nome: "1 Ano A",
    turno: "Matutino",
    alunos: 28,
  },
  {
    id: "2",
    nome: "2 Ano B",
    turno: "Vespertino",
    alunos: 31,
  },
  {
    id: "3",
    nome: "3 Ano A",
    turno: "Matutino",
    alunos: 26,
  },
];
