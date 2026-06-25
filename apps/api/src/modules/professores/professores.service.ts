import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import {
  rotuloParaStatus,
  statusParaRotulo,
} from '../../common/utils/status.util';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { UpdateProfessorDto } from './dto/update-professor.dto';
import {
  PROFESSORES_REPOSITORY,
  ProfessorComDisciplinas,
  ProfessoresRepository,
} from './repositories/professores.repository';

/** Resposta compatível com o frontend (mocks/professores.ts). */
export interface ProfessorResponse {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  status: 'Ativo' | 'Inativo';
  disciplina: string;
  disciplinaId: string;
  acessoSistema: boolean;
}

@Injectable()
export class ProfessoresService {
  constructor(
    @Inject(PROFESSORES_REPOSITORY)
    private readonly professoresRepository: ProfessoresRepository,
  ) {}

  async create(dto: CreateProfessorDto): Promise<ProfessorResponse> {
    const professor = await this.professoresRepository
      .create({
        nome: dto.nome,
        email: dto.email,
        telefone: dto.telefone,
        status: rotuloParaStatus(dto.status),
      })
      .catch((error) => this.tratarConflitoEmail(error));

    // Se a coordenação informou uma senha, cria o acesso (login) do professor.
    if (dto.senha) {
      const senhaHash = await bcrypt.hash(dto.senha, 10);
      await this.professoresRepository
        .criarAcesso({
          nome: dto.nome,
          email: dto.email,
          senhaHash,
          professorId: professor.id,
        })
        .catch((error) => {
          if (error?.code === 'P2002') {
            throw new ConflictException(
              'Já existe um usuário com este e-mail.',
            );
          }
          throw error;
        });
      return { ...this.toResponse(professor), acessoSistema: true };
    }

    return this.toResponse(professor);
  }

  async findAll(): Promise<ProfessorResponse[]> {
    const professores = await this.professoresRepository.findAll();
    return professores.map((professor) => this.toResponse(professor));
  }

  async findOne(id: string): Promise<ProfessorResponse> {
    const professor = await this.professoresRepository.findById(id);
    if (!professor) {
      throw new NotFoundException(`Professor ${id} não encontrado.`);
    }
    return this.toResponse(professor);
  }

  async update(
    id: string,
    dto: UpdateProfessorDto,
  ): Promise<ProfessorResponse> {
    await this.findOne(id);
    const professor = await this.professoresRepository
      .update(id, {
        nome: dto.nome,
        email: dto.email,
        telefone: dto.telefone,
        status: dto.status ? rotuloParaStatus(dto.status) : undefined,
      })
      .catch((error) => this.tratarConflitoEmail(error));
    return this.toResponse(professor);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.professoresRepository.delete(id);
  }

  private tratarConflitoEmail(error: { code?: string }): never {
    if (error?.code === 'P2002') {
      throw new ConflictException('Já existe um professor com este e-mail.');
    }
    throw error;
  }

  private toResponse(professor: ProfessorComDisciplinas): ProfessorResponse {
    const disciplina = professor.disciplinas[0];
    return {
      id: professor.id,
      nome: professor.nome,
      email: professor.email,
      telefone: professor.telefone,
      status: statusParaRotulo(professor.status),
      disciplina: disciplina?.nome ?? 'A definir',
      disciplinaId: disciplina?.id ?? '',
      acessoSistema: Boolean(professor.user),
    };
  }
}
