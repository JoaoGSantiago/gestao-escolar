import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Frequencia } from '@prisma/client';
import { FrequenciasService } from './frequencias.service';
import {
  FREQUENCIAS_REPOSITORY,
  FrequenciasRepository,
} from './repositories/frequencias.repository';

function fakeFrequencia(over: Partial<Frequencia> = {}): Frequencia {
  return {
    id: 'FREQ001',
    alunoId: 'ALU001',
    disciplinaId: 'DIS002',
    aulasPrevistas: 20,
    presencas: 18,
    faltas: 2,
    percentual: 90,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...over,
  };
}

describe('FrequenciasService', () => {
  let service: FrequenciasService;
  let repo: jest.Mocked<FrequenciasRepository>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        FrequenciasService,
        {
          provide: FREQUENCIAS_REPOSITORY,
          useValue: {
            findAll: jest.fn(),
            findById: jest.fn(),
            findByAlunoDisciplina: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = moduleRef.get(FrequenciasService);
    repo = moduleRef.get(FREQUENCIAS_REPOSITORY);
  });

  it('recalcula o percentual ao atualizar (20 presenças / 20 = 100%)', async () => {
    repo.findByAlunoDisciplina.mockResolvedValue(fakeFrequencia());
    repo.update.mockImplementation(async (_id, data) =>
      fakeFrequencia(data as Partial<Frequencia>),
    );

    const result = await service.registrar({
      alunoId: 'ALU001',
      disciplinaId: 'DIS002',
      presencas: 20,
      faltas: 0,
    });

    expect(result.percentual).toBe(100);
    expect(repo.update).toHaveBeenCalledWith(
      'FREQ001',
      expect.objectContaining({ percentual: 100 }),
    );
  });

  it('arredonda o percentual para uma casa decimal (19/22 ≈ 86.4%)', async () => {
    repo.findByAlunoDisciplina.mockResolvedValue(null);
    repo.create.mockImplementation(async (data) =>
      fakeFrequencia(data as unknown as Partial<Frequencia>),
    );

    const result = await service.registrar({
      alunoId: 'ALU007',
      disciplinaId: 'DIS001',
      aulasPrevistas: 22,
      presencas: 19,
      faltas: 3,
    });

    expect(result.percentual).toBe(86.4);
  });

  it('retorna percentual 0 quando não há aulas previstas', async () => {
    repo.findByAlunoDisciplina.mockResolvedValue(null);
    repo.create.mockImplementation(async (data) =>
      fakeFrequencia(data as unknown as Partial<Frequencia>),
    );

    const result = await service.registrar({
      alunoId: 'ALU001',
      disciplinaId: 'DIS002',
      aulasPrevistas: 0,
      presencas: 0,
      faltas: 0,
    });

    expect(result.percentual).toBe(0);
  });

  it('lança NotFoundException ao remover frequência inexistente', async () => {
    repo.findById.mockResolvedValue(null);
    await expect(service.remove('ZZZ')).rejects.toThrow(NotFoundException);
  });
});
