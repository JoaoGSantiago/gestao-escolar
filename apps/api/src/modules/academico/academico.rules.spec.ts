import { SituacaoAluno } from '@prisma/client';
import {
  calcularMedia,
  DesempenhoDisciplina,
  ehConcluinte,
  situacaoDisciplina,
  situacaoFinal,
} from './academico.rules';

describe('academico.rules', () => {
  describe('calcularMedia', () => {
    it('calcula a média arredondada a uma casa', () => {
      expect(calcularMedia([8, 7, 9, 8])).toBe(8);
      expect(calcularMedia([7.5, 8.2, 6.9, 7.0])).toBe(7.4);
    });
    it('retorna 0 quando não há notas', () => {
      expect(calcularMedia([])).toBe(0);
    });
  });

  describe('situacaoDisciplina', () => {
    it('reprova por frequência abaixo de 75% mesmo com média alta', () => {
      expect(situacaoDisciplina(9, 70)).toBe('Reprovado');
    });
    it('aprova com média >= 6 e frequência >= 75%', () => {
      expect(situacaoDisciplina(6, 75)).toBe('Aprovado');
    });
    it('coloca em recuperação com média entre 4 e 6', () => {
      expect(situacaoDisciplina(5, 90)).toBe('Recuperação');
    });
    it('reprova com média abaixo de 4', () => {
      expect(situacaoDisciplina(3.5, 90)).toBe('Reprovado');
    });
  });

  describe('situacaoFinal', () => {
    const disc = (situacao: DesempenhoDisciplina['situacao']) =>
      ({ disciplinaId: 'x', nome: 'X', media: 7, frequencia: 90, situacao }) as DesempenhoDisciplina;

    it('aprova quando todas as disciplinas estão aprovadas', () => {
      expect(situacaoFinal([disc('Aprovado'), disc('Aprovado')])).toBe(
        SituacaoAluno.APROVADO,
      );
    });
    it('reprova se qualquer disciplina não estiver aprovada', () => {
      expect(situacaoFinal([disc('Aprovado'), disc('Recuperação')])).toBe(
        SituacaoAluno.REPROVADO,
      );
    });
    it('reprova quando não há disciplinas', () => {
      expect(situacaoFinal([])).toBe(SituacaoAluno.REPROVADO);
    });
  });

  describe('ehConcluinte', () => {
    it('identifica a 3ª série do EM (ordem 12) como concluinte', () => {
      expect(ehConcluinte(12)).toBe(true);
      expect(ehConcluinte(11)).toBe(false);
    });
  });
});
