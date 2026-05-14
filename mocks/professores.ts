export interface Professor {
  id: string;
  nome: string;
  email: string;
  disciplina: string;
}

export const professoresMock: Professor[] = [
  {
    id: "1",
    nome: "Mariana Costa",
    email: "mariana.costa@escola.edu.br",
    disciplina: "Matematica",
  },
  {
    id: "2",
    nome: "Carlos Henrique",
    email: "carlos.henrique@escola.edu.br",
    disciplina: "Historia",
  },
  {
    id: "3",
    nome: "Fernanda Lima",
    email: "fernanda.lima@escola.edu.br",
    disciplina: "Biologia",
  },
];
