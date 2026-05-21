export function gerarId(prefixo: string, tamanhoAtual: number) {
  return `${prefixo}${String(tamanhoAtual + 1).padStart(3, "0")}`;
}

export function mapearTurmaId(turma: string) {
  const mapa: Record<string, string> = {
    "6º Ano": "TUR001",
    "7º Ano": "TUR002",
    "1º Médio": "TUR003",
  };

  return mapa[turma] ?? "TUR999";
}
