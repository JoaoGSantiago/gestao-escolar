export interface Disciplina {
  id: string;
  nome: string;
  cargaHoraria: number;
  professorId: string;
  turmaId: string;
}

export const disciplinasMock: Disciplina[] = [
  {
    id: "DIS001",
    nome: "Matemática",
    cargaHoraria: 80,
    professorId: "PROF001",
    turmaId: "TUR003",
  },
  {
    id: "DIS002",
    nome: "Português",
    cargaHoraria: 60,
    professorId: "PROF002",
    turmaId: "TUR001",
  },
  {
    id: "DIS003",
    nome: "Ciências",
    cargaHoraria: 60,
    professorId: "PROF003",
    turmaId: "TUR001",
  },
  {
    id: "DIS004",
    nome: "História",
    cargaHoraria: 80,
    professorId: "PROF004",
    turmaId: "TUR002",
  },
  {
    id: "DIS005",
    nome: "Geografia",
    cargaHoraria: 60,
    professorId: "PROF005",
    turmaId: "TUR002",
  },
];
