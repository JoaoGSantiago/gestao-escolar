export interface Turma {
  id: string;
  nome: string;
  turno: string;
  alunos: number;
}

export const turmasMock: Turma[] = [
  {
    id: "TUR001",
    nome: "3º Período",
    turno: "Matutino",
    alunos: 3,
  },
  {
    id: "TUR002",
    nome: "5º Período",
    turno: "Vespertino",
    alunos: 2,
  },
  {
    id: "TUR003",
    nome: "7º Período",
    turno: "Noturno",
    alunos: 1,
  },
];
