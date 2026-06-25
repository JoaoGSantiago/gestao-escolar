import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SituacaoAluno } from '@prisma/client';
import {
  calcularMedia,
  DesempenhoDisciplina,
  ehConcluinte,
  situacaoDisciplina,
  situacaoFinal,
} from './academico.rules';
import {
  ACADEMICO_REPOSITORY,
  AcademicoRepository,
  AlunoComDesempenho,
} from './repositories/academico.repository';

export interface BoletimResponse {
  aluno: { id: string; nome: string; turma: string; turmaId: string };
  anoLetivo: number;
  disciplinas: DesempenhoDisciplina[];
  mediaGeral: number;
  frequenciaGeral: number;
  situacaoProjetada: SituacaoAluno;
}

export interface ResultadoAluno {
  id: string;
  nome: string;
  mediaGeral: number;
  frequenciaGeral: number;
  situacao: SituacaoAluno;
  turmaDestino?: string;
}

export interface RelatorioEncerramento {
  turma: { id: string; nome: string };
  totalAvaliados: number;
  aprovados: ResultadoAluno[];
  reprovados: ResultadoAluno[];
  formados: ResultadoAluno[];
}

@Injectable()
export class AcademicoService {
  constructor(
    @Inject(ACADEMICO_REPOSITORY)
    private readonly repo: AcademicoRepository,
  ) {}

  /** Monta o boletim do aluno (médias, frequência e situação projetada). */
  async boletim(alunoId: string): Promise<BoletimResponse> {
    const aluno = await this.repo.buscarAlunoComDesempenho(alunoId);
    if (!aluno) {
      throw new NotFoundException(`Aluno ${alunoId} não encontrado.`);
    }
    return this.montarBoletim(aluno);
  }

  /** Aprova e promove um único aluno (decisão manual da coordenação). */
  async aprovarAluno(alunoId: string): Promise<ResultadoAluno> {
    const aluno = await this.repo.buscarAlunoComDesempenho(alunoId);
    if (!aluno) {
      throw new NotFoundException(`Aluno ${alunoId} não encontrado.`);
    }
    const boletim = this.montarBoletim(aluno);
    return this.promover(aluno, SituacaoAluno.APROVADO, boletim);
  }

  /**
   * Encerra o ano letivo de uma turma: avalia cada aluno, promove os aprovados
   * para a série seguinte (ou forma os concluintes) e mantém os reprovados.
   */
  async encerrarAno(turmaId: string): Promise<RelatorioEncerramento> {
    const turma = await this.repo.buscarTurma(turmaId);
    if (!turma) {
      throw new NotFoundException(`Turma ${turmaId} não encontrada.`);
    }
    const alunos = await this.repo.buscarAlunosDaTurmaComDesempenho(turmaId);

    const aprovados: ResultadoAluno[] = [];
    const reprovados: ResultadoAluno[] = [];
    const formados: ResultadoAluno[] = [];

    for (const aluno of alunos) {
      const boletim = this.montarBoletim(aluno);
      if (boletim.situacaoProjetada === SituacaoAluno.APROVADO) {
        const resultado = await this.promover(
          aluno,
          SituacaoAluno.APROVADO,
          boletim,
        );
        (resultado.situacao === SituacaoAluno.FORMADO
          ? formados
          : aprovados
        ).push(resultado);
      } else {
        await this.repo.atualizarSituacaoETurma(aluno.id, {
          situacao: SituacaoAluno.REPROVADO,
        });
        reprovados.push(this.resultado(aluno, boletim, SituacaoAluno.REPROVADO));
      }
    }

    return {
      turma: { id: turma.id, nome: turma.nome },
      totalAvaliados: alunos.length,
      aprovados,
      reprovados,
      formados,
    };
  }

  // --------------------------------------------------------------------------
  // Internos
  // --------------------------------------------------------------------------

  private montarBoletim(aluno: AlunoComDesempenho): BoletimResponse {
    // Agrupa notas e frequências por disciplina.
    const notasPorDisc = new Map<string, { nome: string; valores: number[] }>();
    for (const nota of aluno.notas) {
      const entrada = notasPorDisc.get(nota.disciplinaId) ?? {
        nome: nota.disciplina.nome,
        valores: [],
      };
      entrada.valores.push(nota.valor);
      notasPorDisc.set(nota.disciplinaId, entrada);
    }
    const freqPorDisc = new Map<string, number>();
    for (const freq of aluno.frequencias) {
      freqPorDisc.set(freq.disciplinaId, freq.percentual);
    }

    const disciplinas: DesempenhoDisciplina[] = [...notasPorDisc.entries()].map(
      ([disciplinaId, { nome, valores }]) => {
        const media = calcularMedia(valores);
        const frequencia = freqPorDisc.get(disciplinaId) ?? 0;
        return {
          disciplinaId,
          nome,
          media,
          frequencia,
          situacao: situacaoDisciplina(media, frequencia),
        };
      },
    );

    const mediaGeral = calcularMedia(disciplinas.map((d) => d.media));
    const frequenciaGeral = calcularMedia(disciplinas.map((d) => d.frequencia));

    return {
      aluno: {
        id: aluno.id,
        nome: aluno.nome,
        turma: aluno.turma.nome,
        turmaId: aluno.turmaId,
      },
      anoLetivo: aluno.turma.anoLetivo,
      disciplinas,
      mediaGeral,
      frequenciaGeral,
      situacaoProjetada: situacaoFinal(disciplinas),
    };
  }

  /** Promove um aluno aprovado: avança de série ou forma o concluinte. */
  private async promover(
    aluno: AlunoComDesempenho,
    _situacao: SituacaoAluno,
    boletim: BoletimResponse,
  ): Promise<ResultadoAluno> {
    if (boletim.situacaoProjetada !== SituacaoAluno.APROVADO) {
      throw new BadRequestException(
        `Aluno ${aluno.nome} não atingiu os critérios de aprovação (média ≥ 6 e frequência ≥ 75%).`,
      );
    }

    if (ehConcluinte(aluno.turma.ordem)) {
      await this.repo.atualizarSituacaoETurma(aluno.id, {
        situacao: SituacaoAluno.FORMADO,
      });
      return this.resultado(aluno, boletim, SituacaoAluno.FORMADO);
    }

    const destino = await this.repo.buscarTurmaPorOrdem(
      aluno.turma.ordem + 1,
      aluno.turma.turno,
    );
    if (!destino) {
      throw new BadRequestException(
        `Não há turma cadastrada para a série seguinte (ordem ${aluno.turma.ordem + 1}).`,
      );
    }

    // Promovido: matriculado na série seguinte, voltando a CURSANDO no novo ano.
    await this.repo.atualizarSituacaoETurma(aluno.id, {
      situacao: SituacaoAluno.CURSANDO,
      turmaId: destino.id,
    });
    return {
      ...this.resultado(aluno, boletim, SituacaoAluno.APROVADO),
      turmaDestino: destino.nome,
    };
  }

  private resultado(
    aluno: AlunoComDesempenho,
    boletim: BoletimResponse,
    situacao: SituacaoAluno,
  ): ResultadoAluno {
    return {
      id: aluno.id,
      nome: aluno.nome,
      mediaGeral: boletim.mediaGeral,
      frequenciaGeral: boletim.frequenciaGeral,
      situacao,
    };
  }
}
