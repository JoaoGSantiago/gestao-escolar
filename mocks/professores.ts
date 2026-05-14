export interface Professor {
  id: string;
  nome: string;
  email: string;
  disciplina: string;
  disciplinaId: string;
}

export const professoresMock: Professor[] = [
  {
    id: "PROF001",
    nome: "Edvonaldo Silva",
    email: "edvonaldo@ifal.edu.br",
    disciplina: "Inteligência Computacional",
    disciplinaId: "DIS001",
  },
  {
    id: "PROF002",
    nome: "Ítalo Santos",
    email: "italo@ifal.edu.br",
    disciplina: "Programação Web",
    disciplinaId: "DIS002",
  },
  {
    id: "PROF003",
    nome: "Gabriel Souza",
    email: "gabriel@ifal.edu.br",
    disciplina: "Matemática Aplicada",
    disciplinaId: "DIS003",
  },
  {
    id: "PROF004",
    nome: "Larissa Moura",
    email: "larissa@ifal.edu.br",
    disciplina: "Banco de Dados",
    disciplinaId: "DIS004",
  },
  {
    id: "PROF005",
    nome: "Paulo Henrique",
    email: "paulo.h@ifal.edu.br",
    disciplina: "Engenharia de Software",
    disciplinaId: "DIS005",
  },
];
