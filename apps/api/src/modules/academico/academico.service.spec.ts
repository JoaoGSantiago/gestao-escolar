import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { SituacaoAluno, Status, Turma } from '@prisma/client';
import { AcademicoService } from './academico.service';
import {
  ACADEMICO_REPOSITORY,
  AcademicoRepository,
  AlunoComDesempenho,
} from './repositories/academico.repository';

function turma(over: Partial<Turma> = {}): Turma {
  return {
    id: 'TUR006',
    nome: '6º Ano',
    turno: 'Matutino',
    sala: 'Sala 6',
    nivel: 'FUNDAMENTAL_II',
    ordem: 6,
    anoLetivo: 2026,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...over,
  };
}

/** Monta um aluno com N disciplinas, todas com a mesma média e frequência. */
function aluno(
  id: string,
  media: number,
  frequencia: number,
  turmaOver: Partial<Turma> = {},
): AlunoComDesempenho {
  const t = turma(turmaOver);
  const disciplinas = ['DIS1', 'DIS2'];
  return {
    id,
    nome: `Aluno ${id}`,
    email: `${id}@x.com`,
    matricula: id,
    dataNascimento: '2010-01-01',
    status: Status.ATIVO,
    situacao: SituacaoAluno.CURSANDO,
    turmaId: t.id,
    turma: t,
    createdAt: new Date(),
    updatedAt: new Date(),
    notas: disciplinas.flatMap((disciplinaId) =>
      [1, 2, 3, 4].map((b) => ({
        id: `${id}-${disciplinaId}-${b}`,
        avaliacao: `AB${b}`,
        valor: media,
        bimestre: 1,
        alunoId: id,
        disciplinaId,
        createdAt: new Date(),
        updatedAt: new Date(),
        disciplina: {
          id: disciplinaId,
          nome: disciplinaId,
          cargaHoraria: 60,
          professorId: null,
          turmaId: t.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })),
    ),
    frequencias: disciplinas.map((disciplinaId) => ({
      id: `${id}-${disciplinaId}-freq`,
      aulasPrevistas: 40,
      presencas: Math.round((frequencia / 100) * 40),
      faltas: 40 - Math.round((frequencia / 100) * 40),
      percentual: frequencia,
      alunoId: id,
      disciplinaId,
      createdAt: new Date(),
      updatedAt: new Date(),
      disciplina: {
        id: disciplinaId,
        nome: disciplinaId,
        cargaHoraria: 60,
        professorId: null,
        turmaId: t.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })),
  };
}

describe('AcademicoService', () => {
  let service: AcademicoService;
  let repo: jest.Mocked<AcademicoRepository>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AcademicoService,
        {
          provide: ACADEMICO_REPOSITORY,
          useValue: {
            buscarAlunoComDesempenho: jest.fn(),
            buscarAlunosDaTurmaComDesempenho: jest.fn(),
            buscarTurma: jest.fn(),
            buscarTurmaPorOrdem: jest.fn(),
            atualizarSituacaoETurma: jest.fn(),
          },
        },
      ],
    }).compile();

    service = moduleRef.get(AcademicoService);
    repo = moduleRef.get(ACADEMICO_REPOSITORY);
  });

  describe('boletim', () => {
    it('agrega médias, frequência e projeta APROVADO', async () => {
      repo.buscarAlunoComDesempenho.mockResolvedValue(aluno('ALU1', 8, 90));
      const boletim = await service.boletim('ALU1');
      expect(boletim.disciplinas).toHaveLength(2);
      expect(boletim.mediaGeral).toBe(8);
      expect(boletim.frequenciaGeral).toBe(90);
      expect(boletim.situacaoProjetada).toBe(SituacaoAluno.APROVADO);
    });

    it('projeta REPROVADO quando a frequência é insuficiente', async () => {
      repo.buscarAlunoComDesempenho.mockResolvedValue(aluno('ALU2', 9, 60));
      const boletim = await service.boletim('ALU2');
      expect(boletim.situacaoProjetada).toBe(SituacaoAluno.REPROVADO);
    });

    it('lança NotFound quando o aluno não existe', async () => {
      repo.buscarAlunoComDesempenho.mockResolvedValue(null);
      await expect(service.boletim('ZZZ')).rejects.toThrow(NotFoundException);
    });
  });

  describe('aprovarAluno', () => {
    it('promove o aluno aprovado para a série seguinte', async () => {
      repo.buscarAlunoComDesempenho.mockResolvedValue(aluno('ALU1', 8, 90));
      repo.buscarTurmaPorOrdem.mockResolvedValue(
        turma({ id: 'TUR007', nome: '7º Ano', ordem: 7 }),
      );

      const resultado = await service.aprovarAluno('ALU1');

      expect(repo.buscarTurmaPorOrdem).toHaveBeenCalledWith(7, 'Matutino');
      expect(repo.atualizarSituacaoETurma).toHaveBeenCalledWith('ALU1', {
        situacao: SituacaoAluno.CURSANDO,
        turmaId: 'TUR007',
      });
      expect(resultado.turmaDestino).toBe('7º Ano');
      expect(resultado.situacao).toBe(SituacaoAluno.APROVADO);
    });

    it('forma o concluinte (3ª série EM)', async () => {
      repo.buscarAlunoComDesempenho.mockResolvedValue(
        aluno('ALU3', 8, 90, { id: 'TUR012', nome: '3ª Série EM', ordem: 12 }),
      );

      const resultado = await service.aprovarAluno('ALU3');

      expect(repo.atualizarSituacaoETurma).toHaveBeenCalledWith('ALU3', {
        situacao: SituacaoAluno.FORMADO,
      });
      expect(resultado.situacao).toBe(SituacaoAluno.FORMADO);
      expect(repo.buscarTurmaPorOrdem).not.toHaveBeenCalled();
    });

    it('impede a aprovação de quem não atingiu os critérios', async () => {
      repo.buscarAlunoComDesempenho.mockResolvedValue(aluno('ALU4', 4, 90));
      await expect(service.aprovarAluno('ALU4')).rejects.toThrow(
        BadRequestException,
      );
      expect(repo.atualizarSituacaoETurma).not.toHaveBeenCalled();
    });
  });

  describe('encerrarAno', () => {
    it('separa aprovados, reprovados e atualiza a situação de cada um', async () => {
      repo.buscarTurma.mockResolvedValue(turma());
      repo.buscarTurmaPorOrdem.mockResolvedValue(
        turma({ id: 'TUR007', nome: '7º Ano', ordem: 7 }),
      );
      repo.buscarAlunosDaTurmaComDesempenho.mockResolvedValue([
        aluno('APROVADO', 8, 90),
        aluno('REPROVADO', 3, 90),
      ]);

      const relatorio = await service.encerrarAno('TUR006');

      expect(relatorio.totalAvaliados).toBe(2);
      expect(relatorio.aprovados.map((a) => a.id)).toEqual(['APROVADO']);
      expect(relatorio.reprovados.map((a) => a.id)).toEqual(['REPROVADO']);
      expect(repo.atualizarSituacaoETurma).toHaveBeenCalledWith('REPROVADO', {
        situacao: SituacaoAluno.REPROVADO,
      });
    });

    it('classifica concluintes aprovados como formados', async () => {
      repo.buscarTurma.mockResolvedValue(turma({ ordem: 12 }));
      repo.buscarAlunosDaTurmaComDesempenho.mockResolvedValue([
        aluno('FORM', 9, 95, { ordem: 12 }),
      ]);

      const relatorio = await service.encerrarAno('TUR012');

      expect(relatorio.formados.map((a) => a.id)).toEqual(['FORM']);
      expect(relatorio.aprovados).toHaveLength(0);
    });

    it('lança NotFound quando a turma não existe', async () => {
      repo.buscarTurma.mockResolvedValue(null);
      await expect(service.encerrarAno('ZZZ')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
