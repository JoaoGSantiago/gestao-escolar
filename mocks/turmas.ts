export interface Turma {
  id: string;
  nome: string;
  turno: string;
  alunos: number;
}

export const turmasMock: Turma[] = [
  {
    id: "TUR001",
    nome: "6º Ano",
    turno: "Matutino",
    alunos: 3,
  },
  {
    id: "TUR002",
    nome: "7º Ano",
    turno: "Vespertino",
    alunos: 2,
  },
  {
    id: "TUR003",
    nome: "1º Médio",
    turno: "Matutino",
    alunos: 4,
  },
];
