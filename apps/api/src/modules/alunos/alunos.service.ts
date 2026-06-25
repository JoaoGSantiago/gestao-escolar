import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  rotuloParaStatus,
  statusParaRotulo,
} from '../../common/utils/status.util';
import { CreateAlunoDto } from './dto/create-aluno.dto';
import { UpdateAlunoDto } from './dto/update-aluno.dto';
import {
  ALUNOS_REPOSITORY,
  AlunoComTurma,
  AlunosRepository,
} from './repositories/alunos.repository';

/** Resposta compatível com o frontend (mocks/alunos.ts). */
export interface AlunoResponse {
  id: string;
  nome: string;
  email: string;
  turma: string;
  turmaId: string;
  matricula: string | null;
  dataNascimento: string | null;
  status: 'Ativo' | 'Inativo';
  situacao: string;
}

@Injectable()
export class AlunosService {
  constructor(
    @Inject(ALUNOS_REPOSITORY)
    private readonly alunosRepository: AlunosRepository,
  ) {}

  async create(dto: CreateAlunoDto): Promise<AlunoResponse> {
    const aluno = await this.alunosRepository
      .create({
        nome: dto.nome,
        email: dto.email,
        matricula: dto.matricula,
        dataNascimento: dto.dataNascimento,
        status: rotuloParaStatus(dto.status),
        turma: { connect: { id: dto.turmaId } },
      })
      .catch((error) => this.tratarErro(error));
    return this.toResponse(aluno);
  }

  async findAll(): Promise<AlunoResponse[]> {
    const alunos = await this.alunosRepository.findAll();
    return alunos.map((aluno) => this.toResponse(aluno));
  }

  async findByTurma(turmaId: string): Promise<AlunoResponse[]> {
    const alunos = await this.alunosRepository.findByTurma(turmaId);
    return alunos.map((aluno) => this.toResponse(aluno));
  }

  async findOne(id: string): Promise<AlunoResponse> {
    const aluno = await this.alunosRepository.findById(id);
    if (!aluno) {
      throw new NotFoundException(`Aluno ${id} não encontrado.`);
    }
    return this.toResponse(aluno);
  }

  async update(id: string, dto: UpdateAlunoDto): Promise<AlunoResponse> {
    await this.findOne(id);
    const aluno = await this.alunosRepository
      .update(id, {
        nome: dto.nome,
        email: dto.email,
        matricula: dto.matricula,
        dataNascimento: dto.dataNascimento,
        status: dto.status ? rotuloParaStatus(dto.status) : undefined,
        turma: dto.turmaId ? { connect: { id: dto.turmaId } } : undefined,
      })
      .catch((error) => this.tratarErro(error));
    return this.toResponse(aluno);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.alunosRepository.delete(id);
  }

  private tratarErro(error: { code?: string }): never {
    if (error?.code === 'P2002') {
      throw new ConflictException(
        'Já existe um aluno com este e-mail ou matrícula.',
      );
    }
    if (error?.code === 'P2025' || error?.code === 'P2003') {
      throw new BadRequestException('Turma informada não existe.');
    }
    throw error;
  }

  private toResponse(aluno: AlunoComTurma): AlunoResponse {
    return {
      id: aluno.id,
      nome: aluno.nome,
      email: aluno.email,
      turma: aluno.turma.nome,
      turmaId: aluno.turmaId,
      matricula: aluno.matricula,
      dataNascimento: aluno.dataNascimento,
      status: statusParaRotulo(aluno.status),
      situacao: aluno.situacao,
    };
  }
}
