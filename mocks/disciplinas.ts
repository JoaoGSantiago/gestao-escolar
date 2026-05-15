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
    nome: "Inteligência Computacional",
    cargaHoraria: 80,
    professorId: "PROF001",
    turmaId: "TUR003",
  },
  {
    id: "DIS002",
    nome: "Programação Web",
    cargaHoraria: 60,
    professorId: "PROF002",
    turmaId: "TUR001",
  },
  {
    id: "DIS003",
    nome: "Matemática Aplicada",
    cargaHoraria: 60,
    professorId: "PROF003",
    turmaId: "TUR001",
  },
  {
    id: "DIS004",
    nome: "Banco de Dados",
    cargaHoraria: 80,
    professorId: "PROF004",
    turmaId: "TUR002",
  },
  {
    id: "DIS005",
    nome: "Engenharia de Software",
    cargaHoraria: 60,
    professorId: "PROF005",
    turmaId: "TUR002",
  },
];
