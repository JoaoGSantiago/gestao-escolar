import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Status } from '@prisma/client';
import {
  PROFESSORES_REPOSITORY,
  ProfessorComDisciplinas,
  ProfessoresRepository,
} from './repositories/professores.repository';
import { ProfessoresService } from './professores.service';

function fakeProfessor(
  over: Partial<ProfessorComDisciplinas> = {},
): ProfessorComDisciplinas {
  return {
    id: 'PROF001',
    nome: 'Edvonaldo',
    email: 'edvonaldo@escola.edu.br',
    telefone: '(82) 99999-0000',
    status: Status.ATIVO,
    createdAt: new Date(),
    updatedAt: new Date(),
    disciplinas: [
      {
        id: 'DIS001',
        nome: 'Matemática',
        cargaHoraria: 80,
        professorId: 'PROF001',
        turmaId: 'TUR003',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    ...over,
  };
}

describe('ProfessoresService', () => {
  let service: ProfessoresService;
  let repo: jest.Mocked<ProfessoresRepository>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ProfessoresService,
        {
          provide: PROFESSORES_REPOSITORY,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            criarAcesso: jest.fn(),
          },
        },
      ],
    }).compile();

    service = moduleRef.get(ProfessoresService);
    repo = moduleRef.get(PROFESSORES_REPOSITORY);
  });

  it('deriva disciplina e disciplinaId da primeira disciplina', async () => {
    repo.findAll.mockResolvedValue([fakeProfessor()]);
    const [prof] = await service.findAll();
    expect(prof.disciplina).toBe('Matemática');
    expect(prof.disciplinaId).toBe('DIS001');
  });

  it('usa "A definir" quando o professor não tem disciplinas', async () => {
    repo.findById.mockResolvedValue(fakeProfessor({ disciplinas: [] }));
    const prof = await service.findOne('PROF001');
    expect(prof.disciplina).toBe('A definir');
    expect(prof.disciplinaId).toBe('');
  });

  it('cria acesso (login) quando uma senha é informada', async () => {
    repo.create.mockResolvedValue(fakeProfessor());
    repo.criarAcesso.mockResolvedValue(undefined);
    const prof = await service.create({
      nome: 'Edvonaldo',
      email: 'edvonaldo@escola.edu.br',
      senha: 'Senha@123',
    });
    expect(repo.criarAcesso).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'edvonaldo@escola.edu.br',
        professorId: 'PROF001',
      }),
    );
    expect(prof.acessoSistema).toBe(true);
  });

  it('não cria acesso quando nenhuma senha é informada', async () => {
    repo.create.mockResolvedValue(fakeProfessor());
    await service.create({ nome: 'Edvonaldo', email: 'x@escola.edu.br' });
    expect(repo.criarAcesso).not.toHaveBeenCalled();
  });

  it('converte e-mail duplicado (P2002) em ConflictException', async () => {
    repo.create.mockRejectedValue({ code: 'P2002' });
    await expect(
      service.create({ nome: 'X', email: 'dup@escola.edu.br' }),
    ).rejects.toThrow(ConflictException);
  });

  it('lança NotFoundException ao buscar professor inexistente', async () => {
    repo.findById.mockResolvedValue(null);
    await expect(service.findOne('ZZZ')).rejects.toThrow(NotFoundException);
  });

  it('atualiza professor existente convertendo o status', async () => {
    repo.findById.mockResolvedValue(fakeProfessor());
    repo.update.mockResolvedValue(fakeProfessor({ status: Status.INATIVO }));
    const result = await service.update('PROF001', { status: 'Inativo' });
    expect(repo.update).toHaveBeenCalledWith(
      'PROF001',
      expect.objectContaining({ status: Status.INATIVO }),
    );
    expect(result.status).toBe('Inativo');
  });

  it('remove professor existente', async () => {
    repo.findById.mockResolvedValue(fakeProfessor());
    repo.delete.mockResolvedValue();
    await service.remove('PROF001');
    expect(repo.delete).toHaveBeenCalledWith('PROF001');
  });
});
