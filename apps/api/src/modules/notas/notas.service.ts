import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Nota } from '@prisma/client';
import { CreateNotaDto } from './dto/create-nota.dto';
import { UpdateNotaDto } from './dto/update-nota.dto';
import {
  NOTAS_REPOSITORY,
  NotasRepository,
} from './repositories/notas.repository';

/** Resposta compatível com o frontend (mocks/notas.ts). */
export interface NotaResponse {
  id: string;
  alunoId: string;
  disciplinaId: string;
  avaliacao: string;
  valor: number;
  bimestre: number;
}

@Injectable()
export class NotasService {
  constructor(
    @Inject(NOTAS_REPOSITORY)
    private readonly notasRepository: NotasRepository,
  ) {}

  /**
   * Registra uma nota. Se já existir uma nota para a mesma
   * (aluno, disciplina, avaliação, bimestre), atualiza o valor (upsert),
   * espelhando o comportamento de `atualizarNota` do frontend.
   */
  async registrar(dto: CreateNotaDto): Promise<NotaResponse> {
    const existente = await this.notasRepository.findByChave({
      alunoId: dto.alunoId,
      disciplinaId: dto.disciplinaId,
      avaliacao: dto.avaliacao,
      bimestre: dto.bimestre,
    });

    if (existente) {
      const atualizada = await this.notasRepository.update(existente.id, {
        valor: dto.valor,
      });
      return this.toResponse(atualizada);
    }

    const nota = await this.notasRepository
      .create({
        avaliacao: dto.avaliacao,
        valor: dto.valor,
        bimestre: dto.bimestre,
        aluno: { connect: { id: dto.alunoId } },
        disciplina: { connect: { id: dto.disciplinaId } },
      })
      .catch((error) => this.tratarErro(error));
    return this.toResponse(nota);
  }

  async findAll(filtro?: {
    alunoId?: string;
    disciplinaId?: string;
  }): Promise<NotaResponse[]> {
    const notas = await this.notasRepository.findAll(filtro);
    return notas.map((nota) => this.toResponse(nota));
  }

  async findOne(id: string): Promise<NotaResponse> {
    const nota = await this.notasRepository.findById(id);
    if (!nota) {
      throw new NotFoundException(`Nota ${id} não encontrada.`);
    }
    return this.toResponse(nota);
  }

  async update(id: string, dto: UpdateNotaDto): Promise<NotaResponse> {
    await this.findOne(id);
    const nota = await this.notasRepository.update(id, { valor: dto.valor });
    return this.toResponse(nota);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.notasRepository.delete(id);
  }

  private tratarErro(error: { code?: string }): never {
    if (error?.code === 'P2025' || error?.code === 'P2003') {
      throw new BadRequestException('Aluno ou disciplina não existem.');
    }
    throw error;
  }

  private toResponse(nota: Nota): NotaResponse {
    return {
      id: nota.id,
      alunoId: nota.alunoId,
      disciplinaId: nota.disciplinaId,
      avaliacao: nota.avaliacao,
      valor: nota.valor,
      bimestre: nota.bimestre,
    };
  }
}
