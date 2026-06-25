import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Disciplina } from '@prisma/client';
import { DisciplinasService } from './disciplinas.service';
import {
  DISCIPLINAS_REPOSITORY,
  DisciplinasRepository,
} from './repositories/disciplinas.repository';

function fakeDisciplina(over: Partial<Disciplina> = {}): Disciplina {
  return {
    id: 'DIS001',
    nome: 'Matemática',
    cargaHoraria: 80,
    professorId: 'PROF001',
    turmaId: 'TUR003',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...over,
  };
}

describe('DisciplinasService', () => {
  let service: DisciplinasService;
  let repo: jest.Mocked<DisciplinasRepository>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        DisciplinasService,
        {
          provide: DISCIPLINAS_REPOSITORY,
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

    service = moduleRef.get(DisciplinasService);
    repo = moduleRef.get(DISCIPLINAS_REPOSITORY);
  });

  it('expõe professorId e turmaId no response', async () => {
    repo.findAll.mockResolvedValue([fakeDisciplina()]);
    const [disc] = await service.findAll();
    expect(disc).toEqual({
      id: 'DIS001',
      nome: 'Matemática',
      cargaHoraria: 80,
      professorId: 'PROF001',
      turmaId: 'TUR003',
    });
  });

  it('normaliza professorId/turmaId nulos para string vazia', async () => {
    repo.findById.mockResolvedValue(
      fakeDisciplina({ professorId: null, turmaId: null }),
    );
    const disc = await service.findOne('DIS001');
    expect(disc.professorId).toBe('');
    expect(disc.turmaId).toBe('');
  });

  it('converte FK inválida (P2025) em BadRequestException', async () => {
    repo.create.mockRejectedValue({ code: 'P2025' });
    await expect(
      service.create({ nome: 'X', cargaHoraria: 40, professorId: 'ZZZ' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('lança NotFoundException ao atualizar disciplina inexistente', async () => {
    repo.findById.mockResolvedValue(null);
    await expect(
      service.update('ZZZ', { nome: 'Nova' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('atualiza disciplina existente e reconecta turma', async () => {
    repo.findById.mockResolvedValue(fakeDisciplina());
    repo.update.mockResolvedValue(fakeDisciplina({ cargaHoraria: 100 }));
    const result = await service.update('DIS001', {
      cargaHoraria: 100,
      turmaId: 'TUR001',
    });
    expect(repo.update).toHaveBeenCalledWith(
      'DIS001',
      expect.objectContaining({
        cargaHoraria: 100,
        turma: { connect: { id: 'TUR001' } },
      }),
    );
    expect(result.cargaHoraria).toBe(100);
  });

  it('remove disciplina existente', async () => {
    repo.findById.mockResolvedValue(fakeDisciplina());
    repo.delete.mockResolvedValue();
    await service.remove('DIS001');
    expect(repo.delete).toHaveBeenCalledWith('DIS001');
  });
});
