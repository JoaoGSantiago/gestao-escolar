import { Status } from '@prisma/client';

/** Converte o enum do banco (ATIVO/INATIVO) para o rótulo do frontend. */
export function statusParaRotulo(status: Status): 'Ativo' | 'Inativo' {
  return status === Status.ATIVO ? 'Ativo' : 'Inativo';
}

/** Converte o rótulo recebido do frontend para o enum do banco. */
export function rotuloParaStatus(rotulo?: string): Status {
  return rotulo?.toLowerCase() === 'inativo' ? Status.INATIVO : Status.ATIVO;
}
