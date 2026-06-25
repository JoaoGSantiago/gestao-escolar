import { SituacaoAluno } from '@prisma/client';

/** Regras acadêmicas (constantes) — alteráveis em um único lugar. */
export const MEDIA_APROVACAO = 6.0;
export const FREQUENCIA_MINIMA = 75.0;
export const ORDEM_MINIMA = 1;
export const ORDEM_MAXIMA = 12; // 3ª série do Ensino Médio (concluinte)

export type SituacaoDisciplina = 'Aprovado' | 'Recuperação' | 'Reprovado';

export interface DesempenhoDisciplina {
  disciplinaId: string;
  nome: string;
  media: number;
  frequencia: number;
  situacao: SituacaoDisciplina;
}

/** Média aritmética arredondada a uma casa decimal (0 se não houver notas). */
export function calcularMedia(valores: number[]): number {
  if (valores.length === 0) return 0;
  const soma = valores.reduce((acc, v) => acc + v, 0);
  return Math.round((soma / valores.length) * 10) / 10;
}

/** Situação do aluno em uma disciplina, considerando média e frequência. */
export function situacaoDisciplina(
  media: number,
  frequencia: number,
): SituacaoDisciplina {
  if (frequencia < FREQUENCIA_MINIMA) return 'Reprovado';
  if (media >= MEDIA_APROVACAO) return 'Aprovado';
  if (media >= MEDIA_APROVACAO - 2) return 'Recuperação';
  return 'Reprovado';
}

/**
 * Situação final do aluno no ano: APROVADO somente se em TODAS as disciplinas
 * tiver média suficiente e frequência mínima.
 */
export function situacaoFinal(
  disciplinas: DesempenhoDisciplina[],
): SituacaoAluno {
  if (disciplinas.length === 0) return SituacaoAluno.REPROVADO;
  const todasAprovadas = disciplinas.every((d) => d.situacao === 'Aprovado');
  return todasAprovadas ? SituacaoAluno.APROVADO : SituacaoAluno.REPROVADO;
}

/** Indica se a série é a concluinte (3ª série do EM). */
export function ehConcluinte(ordem: number): boolean {
  return ordem >= ORDEM_MAXIMA;
}
