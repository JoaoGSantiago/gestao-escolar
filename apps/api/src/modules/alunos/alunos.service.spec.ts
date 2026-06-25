import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Status } from '@prisma/client';
import { AlunosService } from './alunos.service';
import {
  ALUNOS_REPOSITORY,
  AlunoComTurma,
  AlunosRepository,
} from './repositories/alunos.repository';

function fakeAluno(over: Partial<AlunoComTurma> = {}): AlunoComTurma {
  return {
    id: 'ALU001',
    nome: 'João',
    email: 'joao@aluno.edu.br',
    matricula: '2026001',
    dataNascimento: '2005-01-01',
    status: Status.ATIVO,
    situacao: 'CURSANDO',
    turmaId: 'TUR001',
    createdAt: new Date(),
    updatedAt: new Date(),
    turma: {
      id: 'TUR001',
      nome: '6º Ano',
      turno: 'Matutino',
      sala: 'Sala 1',
      nivel: 'FUNDAMENTAL_II',
      ordem: 6,
      anoLetivo: 2026,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    ...over,
  };
}

describe('AlunosService', () => {
  let service: AlunosService;
  let repo: jest.Mocked<AlunosRepository>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AlunosService,
        {
          provide: ALUNOS_REPOSITORY,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            findByTurma: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = moduleRef.get(AlunosService);
    repo = moduleRef.get(ALUNOS_REPOSITORY);
  });

  it('mapeia o nome da turma e o status no response', async () => {
    repo.findAll.mockResolvedValue([fakeAluno()]);
    const [aluno] = await service.findAll();
    expect(aluno.turma).toBe('6º Ano');
    expect(aluno.turmaId).toBe('TUR001');
    expect(aluno.status).toBe('Ativo');
  });

  it('conecta a turma informada ao criar', async () => {
    repo.create.mockResolvedValue(fakeAluno());
    await service.create({
      nome: 'João',
      email: 'joao@aluno.edu.br',
      turmaId: 'TUR001',
    });
    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({ turma: { connect: { id: 'TUR001' } } }),
    );
  });

  it('converte erro de FK (P2003) em BadRequestException', async () => {
    repo.create.mockRejectedValue({ code: 'P2003' });
    await expect(
      service.create({ nome: 'X', email: 'x@x.com', turmaId: 'ZZZ' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('lança NotFoundException ao buscar aluno inexistente', async () => {
    repo.findById.mockResolvedValue(null);
    await expect(service.findOne('ZZZ')).rejects.toThrow(NotFoundException);
  });

  it('filtra alunos por turma', async () => {
    repo.findByTurma.mockResolvedValue([fakeAluno()]);
    const result = await service.findByTurma('TUR001');
    expect(repo.findByTurma).toHaveBeenCalledWith('TUR001');
    expect(result).toHaveLength(1);
  });

  it('atualiza aluno e reconecta turma quando turmaId é informado', async () => {
    repo.findById.mockResolvedValue(fakeAluno());
    repo.update.mockResolvedValue(fakeAluno({ nome: 'João Editado' }));
    const result = await service.update('ALU001', {
      nome: 'João Editado',
      turmaId: 'TUR002',
    });
    expect(repo.update).toHaveBeenCalledWith(
      'ALU001',
      expect.objectContaining({
        nome: 'João Editado',
        turma: { connect: { id: 'TUR002' } },
      }),
    );
    expect(result.nome).toBe('João Editado');
  });

  it('remove aluno existente', async () => {
    repo.findById.mockResolvedValue(fakeAluno());
    repo.delete.mockResolvedValue();
    await service.remove('ALU001');
    expect(repo.delete).toHaveBeenCalledWith('ALU001');
  });
});
