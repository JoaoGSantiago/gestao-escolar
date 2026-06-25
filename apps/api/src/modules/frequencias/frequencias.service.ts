import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Frequencia } from '@prisma/client';
import { UpsertFrequenciaDto } from './dto/upsert-frequencia.dto';
import {
  FREQUENCIAS_REPOSITORY,
  FrequenciasRepository,
} from './repositories/frequencias.repository';

/** Resposta compatível com o frontend (mocks/frequencia.ts). */
export interface FrequenciaResponse {
  id: string;
  alunoId: string;
  disciplinaId: string;
  aulasPrevistas: number;
  presencas: number;
  faltas: number;
  percentual: number;
}

@Injectable()
export class FrequenciasService {
  constructor(
    @Inject(FREQUENCIAS_REPOSITORY)
    private readonly frequenciasRepository: FrequenciasRepository,
  ) {}

  /**
   * Cria ou atualiza a frequência de um aluno em uma disciplina,
   * recalculando o percentual de presença. Espelha `atualizarFrequencia`.
   */
  async registrar(dto: UpsertFrequenciaDto): Promise<FrequenciaResponse> {
    const existente = await this.frequenciasRepository.findByAlunoDisciplina(
      dto.alunoId,
      dto.disciplinaId,
    );

    const aulasPrevistas =
      dto.aulasPrevistas ?? existente?.aulasPrevistas ?? 0;
    const percentual = this.calcularPercentual(dto.presencas, aulasPrevistas);

    if (existente) {
      const atualizada = await this.frequenciasRepository.update(
        existente.id,
        {
          aulasPrevistas,
          presencas: dto.presencas,
          faltas: dto.faltas,
          percentual,
        },
      );
      return this.toResponse(atualizada);
    }

    const frequencia = await this.frequenciasRepository
      .create({
        aulasPrevistas,
        presencas: dto.presencas,
        faltas: dto.faltas,
        percentual,
        aluno: { connect: { id: dto.alunoId } },
        disciplina: { connect: { id: dto.disciplinaId } },
      })
      .catch((error) => this.tratarErro(error));
    return this.toResponse(frequencia);
  }

  async findAll(filtro?: {
    alunoId?: string;
    disciplinaId?: string;
  }): Promise<FrequenciaResponse[]> {
    const frequencias = await this.frequenciasRepository.findAll(filtro);
    return frequencias.map((frequencia) => this.toResponse(frequencia));
  }

  async findOne(id: string): Promise<FrequenciaResponse> {
    const frequencia = await this.frequenciasRepository.findById(id);
    if (!frequencia) {
      throw new NotFoundException(`Frequência ${id} não encontrada.`);
    }
    return this.toResponse(frequencia);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.frequenciasRepository.delete(id);
  }

  /** Percentual de presença arredondado a uma casa decimal. */
  private calcularPercentual(presencas: number, aulasPrevistas: number): number {
    if (!aulasPrevistas) {
      return 0;
    }
    return Math.round((presencas / aulasPrevistas) * 1000) / 10;
  }

  private tratarErro(error: { code?: string }): never {
    if (error?.code === 'P2025' || error?.code === 'P2003') {
      throw new BadRequestException('Aluno ou disciplina não existem.');
    }
    throw error;
  }

  private toResponse(frequencia: Frequencia): FrequenciaResponse {
    return {
      id: frequencia.id,
      alunoId: frequencia.alunoId,
      disciplinaId: frequencia.disciplinaId,
      aulasPrevistas: frequencia.aulasPrevistas,
      presencas: frequencia.presencas,
      faltas: frequencia.faltas,
      percentual: frequencia.percentual,
    };
  }
}
