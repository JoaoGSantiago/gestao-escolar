export interface Nota {
  id: string;
  alunoId: string;
  disciplinaId: string;
  avaliacao: string;
  valor: number;
  periodo: string;
}

export const notasMock: Nota[] = [
  {
    id: "NOTA001",
    alunoId: "ALU001",
    disciplinaId: "DIS002",
    avaliacao: "AV1",
    valor: 8.5,
    periodo: "2026.1",
  },
  {
    id: "NOTA002",
    alunoId: "ALU001",
    disciplinaId: "DIS003",
    avaliacao: "AV1",
    valor: 7.8,
    periodo: "2026.1",
  },
  {
    id: "NOTA003",
    alunoId: "ALU002",
    disciplinaId: "DIS002",
    avaliacao: "AV1",
    valor: 9.1,
    periodo: "2026.1",
  },
  {
    id: "NOTA004",
    alunoId: "ALU002",
    disciplinaId: "DIS003",
    avaliacao: "AV1",
    valor: 6.9,
    periodo: "2026.1",
  },
  {
    id: "NOTA005",
    alunoId: "ALU003",
    disciplinaId: "DIS002",
    avaliacao: "AV1",
    valor: 7.4,
    periodo: "2026.1",
  },
  {
    id: "NOTA006",
    alunoId: "ALU004",
    disciplinaId: "DIS004",
    avaliacao: "AV1",
    valor: 8.9,
    periodo: "2026.1",
  },
  {
    id: "NOTA007",
    alunoId: "ALU005",
    disciplinaId: "DIS005",
    avaliacao: "AV1",
    valor: 7.2,
    periodo: "2026.1",
  },
  {
    id: "NOTA008",
    alunoId: "ALU006",
    disciplinaId: "DIS001",
    avaliacao: "Projeto Final",
    valor: 9.4,
    periodo: "2026.1",
  },
];
