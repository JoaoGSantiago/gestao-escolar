import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Disciplina } from '@prisma/client';
import { CreateDisciplinaDto } from './dto/create-disciplina.dto';
import { UpdateDisciplinaDto } from './dto/update-disciplina.dto';
import {
  DISCIPLINAS_REPOSITORY,
  DisciplinasRepository,
} from './repositories/disciplinas.repository';

/** Resposta compatível com o frontend (mocks/disciplinas.ts). */
export interface DisciplinaResponse {
  id: string;
  nome: string;
  cargaHoraria: number;
  professorId: string;
  turmaId: string;
}

@Injectable()
export class DisciplinasService {
  constructor(
    @Inject(DISCIPLINAS_REPOSITORY)
    private readonly disciplinasRepository: DisciplinasRepository,
  ) {}

  async create(dto: CreateDisciplinaDto): Promise<DisciplinaResponse> {
    const disciplina = await this.disciplinasRepository
      .create({
        nome: dto.nome,
        cargaHoraria: dto.cargaHoraria,
        professor: dto.professorId
          ? { connect: { id: dto.professorId } }
          : undefined,
        turma: dto.turmaId ? { connect: { id: dto.turmaId } } : undefined,
      })
      .catch((error) => this.tratarErro(error));
    return this.toResponse(disciplina);
  }

  async findAll(): Promise<DisciplinaResponse[]> {
    const disciplinas = await this.disciplinasRepository.findAll();
    return disciplinas.map((disciplina) => this.toResponse(disciplina));
  }

  async findOne(id: string): Promise<DisciplinaResponse> {
    const disciplina = await this.disciplinasRepository.findById(id);
    if (!disciplina) {
      throw new NotFoundException(`Disciplina ${id} não encontrada.`);
    }
    return this.toResponse(disciplina);
  }

  async update(
    id: string,
    dto: UpdateDisciplinaDto,
  ): Promise<DisciplinaResponse> {
    await this.findOne(id);
    const disciplina = await this.disciplinasRepository
      .update(id, {
        nome: dto.nome,
        cargaHoraria: dto.cargaHoraria,
        professor: dto.professorId
          ? { connect: { id: dto.professorId } }
          : undefined,
        turma: dto.turmaId ? { connect: { id: dto.turmaId } } : undefined,
      })
      .catch((error) => this.tratarErro(error));
    return this.toResponse(disciplina);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.disciplinasRepository.delete(id);
  }

  private tratarErro(error: { code?: string }): never {
    if (error?.code === 'P2025' || error?.code === 'P2003') {
      throw new BadRequestException(
        'Professor ou turma informados não existem.',
      );
    }
    throw error;
  }

  private toResponse(disciplina: Disciplina): DisciplinaResponse {
    return {
      id: disciplina.id,
      nome: disciplina.nome,
      cargaHoraria: disciplina.cargaHoraria,
      professorId: disciplina.professorId ?? '',
      turmaId: disciplina.turmaId ?? '',
    };
  }
}
