export interface Frequencia {
  id: string;
  alunoId: string;
  disciplinaId: string;
  aulasPrevistas: number;
  presencas: number;
  faltas: number;
  percentual: number;
}

export const frequenciaMock: Frequencia[] = [
  {
    id: "FREQ001",
    alunoId: "ALU001",
    disciplinaId: "DIS002",
    aulasPrevistas: 20,
    presencas: 18,
    faltas: 2,
    percentual: 90,
  },
  {
    id: "FREQ002",
    alunoId: "ALU002",
    disciplinaId: "DIS002",
    aulasPrevistas: 20,
    presencas: 19,
    faltas: 1,
    percentual: 95,
  },
  {
    id: "FREQ003",
    alunoId: "ALU003",
    disciplinaId: "DIS003",
    aulasPrevistas: 20,
    presencas: 16,
    faltas: 4,
    percentual: 80,
  },
  {
    id: "FREQ004",
    alunoId: "ALU004",
    disciplinaId: "DIS004",
    aulasPrevistas: 18,
    presencas: 17,
    faltas: 1,
    percentual: 94.4,
  },
  {
    id: "FREQ005",
    alunoId: "ALU005",
    disciplinaId: "DIS005",
    aulasPrevistas: 18,
    presencas: 15,
    faltas: 3,
    percentual: 83.3,
  },
  {
    id: "FREQ006",
    alunoId: "ALU006",
    disciplinaId: "DIS001",
    aulasPrevistas: 22,
    presencas: 21,
    faltas: 1,
    percentual: 95.5,
  },
  {
    id: "FREQ007",
    alunoId: "ALU007",
    disciplinaId: "DIS001",
    aulasPrevistas: 22,
    presencas: 19,
    faltas: 3,
    percentual: 86.4,
  },
  {
    id: "FREQ008",
    alunoId: "ALU008",
    disciplinaId: "DIS001",
    aulasPrevistas: 22,
    presencas: 20,
    faltas: 2,
    percentual: 90.9,
  },
  {
    id: "FREQ009",
    alunoId: "ALU009",
    disciplinaId: "DIS001",
    aulasPrevistas: 22,
    presencas: 17,
    faltas: 5,
    percentual: 77.3,
  },
];
