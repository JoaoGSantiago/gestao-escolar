export interface Turma {
  id: string;
  nome: string;
  turno: string;
  alunos: number;
}

export const turmasMock: Turma[] = [
  {
    id: "TUR001",
    nome: "6º Ano A",
    turno: "Matutino",
    alunos: 3,
  },
  {
    id: "TUR002",
    nome: "7º Ano B",
    turno: "Vespertino",
    alunos: 2,
  },
  {
    id: "TUR003",
    nome: "1º Médio C",
    turno: "Matutino",
    alunos: 3,
  },
];
