import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Nota } from '@prisma/client';
import { NotasService } from './notas.service';
import {
  NOTAS_REPOSITORY,
  NotasRepository,
} from './repositories/notas.repository';

function fakeNota(over: Partial<Nota> = {}): Nota {
  return {
    id: 'NOTA001',
    alunoId: 'ALU001',
    disciplinaId: 'DIS002',
    avaliacao: 'AB1',
    valor: 8.5,
    bimestre: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...over,
  };
}

describe('NotasService', () => {
  let service: NotasService;
  let repo: jest.Mocked<NotasRepository>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        NotasService,
        {
          provide: NOTAS_REPOSITORY,
          useValue: {
            findAll: jest.fn(),
            findById: jest.fn(),
            findByChave: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = moduleRef.get(NotasService);
    repo = moduleRef.get(NOTAS_REPOSITORY);
  });

  const dto = {
    alunoId: 'ALU001',
    disciplinaId: 'DIS002',
    avaliacao: 'AB1',
    valor: 9.5,
    bimestre: 1,
  };

  it('atualiza a nota existente (upsert) sem criar nova', async () => {
    repo.findByChave.mockResolvedValue(fakeNota());
    repo.update.mockResolvedValue(fakeNota({ valor: 9.5 }));

    const result = await service.registrar(dto);

    expect(repo.update).toHaveBeenCalledWith('NOTA001', { valor: 9.5 });
    expect(repo.create).not.toHaveBeenCalled();
    expect(result.valor).toBe(9.5);
  });

  it('cria uma nova nota quando a chave não existe', async () => {
    repo.findByChave.mockResolvedValue(null);
    repo.create.mockResolvedValue(fakeNota({ valor: 9.5 }));

    await service.registrar(dto);

    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        aluno: { connect: { id: 'ALU001' } },
        disciplina: { connect: { id: 'DIS002' } },
        valor: 9.5,
      }),
    );
  });

  it('repassa filtros para o repositório no findAll', async () => {
    repo.findAll.mockResolvedValue([fakeNota()]);
    await service.findAll({ alunoId: 'ALU001' });
    expect(repo.findAll).toHaveBeenCalledWith({ alunoId: 'ALU001' });
  });

  it('lança NotFoundException ao buscar nota inexistente', async () => {
    repo.findById.mockResolvedValue(null);
    await expect(service.findOne('ZZZ')).rejects.toThrow(NotFoundException);
  });

  it('atualiza apenas o valor da nota por id', async () => {
    repo.findById.mockResolvedValue(fakeNota());
    repo.update.mockResolvedValue(fakeNota({ valor: 7 }));
    const result = await service.update('NOTA001', { valor: 7 });
    expect(repo.update).toHaveBeenCalledWith('NOTA001', { valor: 7 });
    expect(result.valor).toBe(7);
  });

  it('remove nota existente', async () => {
    repo.findById.mockResolvedValue(fakeNota());
    repo.delete.mockResolvedValue();
    await service.remove('NOTA001');
    expect(repo.delete).toHaveBeenCalledWith('NOTA001');
  });
});
