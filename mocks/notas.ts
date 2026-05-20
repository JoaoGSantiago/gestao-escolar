export interface Nota {
  id: string;
  alunoId: string;
  disciplinaId: string;
  avaliacao: string;
  valor: number;
  bimestre: number;
}

export const notasMock: Nota[] = [
  // ALU001 - DIS002 (Matemática)
  { id: "NOTA001", alunoId: "ALU001", disciplinaId: "DIS002", avaliacao: "AB1", valor: 8.5, bimestre: 1 },
  { id: "NOTA002", alunoId: "ALU001", disciplinaId: "DIS002", avaliacao: "AB2", valor: 7.9, bimestre: 1 },
  { id: "NOTA003", alunoId: "ALU001", disciplinaId: "DIS002", avaliacao: "AB3", valor: 8.1, bimestre: 1 },
  { id: "NOTA004", alunoId: "ALU001", disciplinaId: "DIS002", avaliacao: "AB4", valor: 8.3, bimestre: 1 },
  
  // ALU001 - DIS003
  { id: "NOTA005", alunoId: "ALU001", disciplinaId: "DIS003", avaliacao: "AB1", valor: 7.8, bimestre: 1 },
  { id: "NOTA006", alunoId: "ALU001", disciplinaId: "DIS003", avaliacao: "AB2", valor: 8.2, bimestre: 1 },
  { id: "NOTA007", alunoId: "ALU001", disciplinaId: "DIS003", avaliacao: "AB3", valor: 7.5, bimestre: 1 },
  { id: "NOTA008", alunoId: "ALU001", disciplinaId: "DIS003", avaliacao: "AB4", valor: 8, bimestre: 1 },

  // ALU002 - DIS002
  { id: "NOTA009", alunoId: "ALU002", disciplinaId: "DIS002", avaliacao: "AB1", valor: 9.1, bimestre: 1 },
  { id: "NOTA010", alunoId: "ALU002", disciplinaId: "DIS002", avaliacao: "AB2", valor: 8.8, bimestre: 1 },
  { id: "NOTA011", alunoId: "ALU002", disciplinaId: "DIS002", avaliacao: "AB3", valor: 9, bimestre: 1 },
  { id: "NOTA012", alunoId: "ALU002", disciplinaId: "DIS002", avaliacao: "AB4", valor: 8.9, bimestre: 1 },

  // ALU002 - DIS003
  { id: "NOTA013", alunoId: "ALU002", disciplinaId: "DIS003", avaliacao: "AB1", valor: 6.9, bimestre: 1 },
  { id: "NOTA014", alunoId: "ALU002", disciplinaId: "DIS003", avaliacao: "AB2", valor: 7.1, bimestre: 1 },
  { id: "NOTA015", alunoId: "ALU002", disciplinaId: "DIS003", avaliacao: "AB3", valor: 7.3, bimestre: 1 },
  { id: "NOTA016", alunoId: "ALU002", disciplinaId: "DIS003", avaliacao: "AB4", valor: 7, bimestre: 1 },

  // ALU003 - DIS002
  { id: "NOTA017", alunoId: "ALU003", disciplinaId: "DIS002", avaliacao: "AB1", valor: 7.4, bimestre: 1 },
  { id: "NOTA018", alunoId: "ALU003", disciplinaId: "DIS002", avaliacao: "AB2", valor: 7.6, bimestre: 1 },
  { id: "NOTA019", alunoId: "ALU003", disciplinaId: "DIS002", avaliacao: "AB3", valor: 7.2, bimestre: 1 },
  { id: "NOTA020", alunoId: "ALU003", disciplinaId: "DIS002", avaliacao: "AB4", valor: 7.5, bimestre: 1 },
];
