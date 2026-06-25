export interface Turma {
  id: string;
  nome: string;
  turno: string;
  sala: string;
  nivel: string;
  ordem: number;
  anoLetivo: number;
  alunos: number;
}

// Dados de exemplo (a aplicação carrega as turmas reais via API).
export const turmasMock: Turma[] = [
  {
    id: "TUR001",
    nome: "6º Ano",
    turno: "Matutino",
    sala: "Sala 6",
    nivel: "FUNDAMENTAL_II",
    ordem: 6,
    anoLetivo: 2026,
    alunos: 3,
  },
];
