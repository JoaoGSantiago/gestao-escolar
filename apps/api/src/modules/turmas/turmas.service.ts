import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTurmaDto } from './dto/create-turma.dto';
import { UpdateTurmaDto } from './dto/update-turma.dto';
import {
  TURMAS_REPOSITORY,
  TurmaComContagem,
  TurmasRepository,
} from './repositories/turmas.repository';

/** Formato de resposta compatível com o frontend (mocks/turmas.ts). */
export interface TurmaResponse {
  id: string;
  nome: string;
  turno: string;
  sala: string;
  nivel: string;
  ordem: number;
  anoLetivo: number;
  alunos: number;
}

@Injectable()
export class TurmasService {
  constructor(
    @Inject(TURMAS_REPOSITORY)
    private readonly turmasRepository: TurmasRepository,
  ) {}

  async create(dto: CreateTurmaDto): Promise<TurmaResponse> {
    const turma = await this.turmasRepository.create({
      nome: dto.nome,
      turno: dto.turno,
      sala: dto.sala ?? 'A definir',
      nivel: dto.nivel,
      ordem: dto.ordem,
      anoLetivo: dto.anoLetivo,
    });
    return this.toResponse(turma);
  }

  async findAll(): Promise<TurmaResponse[]> {
    const turmas = await this.turmasRepository.findAll();
    return turmas.map((turma) => this.toResponse(turma));
  }

  async findOne(id: string): Promise<TurmaResponse> {
    const turma = await this.turmasRepository.findById(id);
    if (!turma) {
      throw new NotFoundException(`Turma ${id} não encontrada.`);
    }
    return this.toResponse(turma);
  }

  async update(id: string, dto: UpdateTurmaDto): Promise<TurmaResponse> {
    await this.findOne(id);
    const turma = await this.turmasRepository.update(id, {
      nome: dto.nome,
      turno: dto.turno,
      sala: dto.sala,
      nivel: dto.nivel,
      ordem: dto.ordem,
      anoLetivo: dto.anoLetivo,
    });
    return this.toResponse(turma);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.turmasRepository.delete(id);
  }

  private toResponse(turma: TurmaComContagem): TurmaResponse {
    return {
      id: turma.id,
      nome: turma.nome,
      turno: turma.turno,
      sala: turma.sala,
      nivel: turma.nivel,
      ordem: turma.ordem,
      anoLetivo: turma.anoLetivo,
      alunos: turma._count.alunos,
    };
  }
}
