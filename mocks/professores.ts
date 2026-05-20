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
    email: "edvonaldo@escola.edu.br",
    disciplina: "Matemática",
    disciplinaId: "DIS001",
  },
  {
    id: "PROF002",
    nome: "Ítalo Santos",
    email: "italo@escola.edu.br",
    disciplina: "Português",
    disciplinaId: "DIS002",
  },
  {
    id: "PROF003",
    nome: "Gabriel Souza",
    email: "gabriel@escola.edu.br",
    disciplina: "Ciências",
    disciplinaId: "DIS003",
  },
  {
    id: "PROF004",
    nome: "Larissa Moura",
    email: "larissa@escola.edu.br",
    disciplina: "História",
    disciplinaId: "DIS004",
  },
  {
    id: "PROF005",
    nome: "Paulo Henrique",
    email: "paulo.h@escola.edu.br",
    disciplina: "Geografia",
    disciplinaId: "DIS005",
  },
];
