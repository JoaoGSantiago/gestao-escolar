import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import {
  TURMAS_REPOSITORY,
  TurmaComContagem,
  TurmasRepository,
} from './repositories/turmas.repository';
import { TurmasService } from './turmas.service';

function fakeTurma(over: Partial<TurmaComContagem> = {}): TurmaComContagem {
  return {
    id: 'TUR001',
    nome: '6º Ano',
    turno: 'Matutino',
    sala: 'Sala 1',
    nivel: 'FUNDAMENTAL_II',
    ordem: 6,
    anoLetivo: 2026,
    createdAt: new Date(),
    updatedAt: new Date(),
    _count: { alunos: 3 },
    ...over,
  };
}

describe('TurmasService', () => {
  let service: TurmasService;
  let repo: jest.Mocked<TurmasRepository>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        TurmasService,
        {
          provide: TURMAS_REPOSITORY,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = moduleRef.get(TurmasService);
    repo = moduleRef.get(TURMAS_REPOSITORY);
  });

  it('mapeia a contagem de alunos no findAll', async () => {
    repo.findAll.mockResolvedValue([fakeTurma()]);
    const result = await service.findAll();
    expect(result).toEqual([
      {
        id: 'TUR001',
        nome: '6º Ano',
        turno: 'Matutino',
        sala: 'Sala 1',
        nivel: 'FUNDAMENTAL_II',
        ordem: 6,
        anoLetivo: 2026,
        alunos: 3,
      },
    ]);
  });

  it('usa "A definir" como sala padrão ao criar sem sala', async () => {
    repo.create.mockResolvedValue(fakeTurma({ sala: 'A definir' }));
    await service.create({ nome: '6º Ano', turno: 'Matutino' });
    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({ sala: 'A definir' }),
    );
  });

  it('lança NotFoundException quando a turma não existe', async () => {
    repo.findById.mockResolvedValue(null);
    await expect(service.findOne('ZZZ')).rejects.toThrow(NotFoundException);
  });

  it('valida existência antes de remover', async () => {
    repo.findById.mockResolvedValue(fakeTurma());
    repo.delete.mockResolvedValue();
    await service.remove('TUR001');
    expect(repo.delete).toHaveBeenCalledWith('TUR001');
  });

  it('atualiza a turma existente e retorna o response mapeado', async () => {
    repo.findById.mockResolvedValue(fakeTurma());
    repo.update.mockResolvedValue(fakeTurma({ sala: 'Sala 10' }));
    const result = await service.update('TUR001', { sala: 'Sala 10' });
    expect(repo.update).toHaveBeenCalledWith('TUR001', {
      nome: undefined,
      turno: undefined,
      sala: 'Sala 10',
    });
    expect(result.sala).toBe('Sala 10');
  });
});
