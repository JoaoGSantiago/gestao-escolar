import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { AcademicoService } from './academico.service';

@Controller('academico')
export class AcademicoController {
  constructor(private readonly academicoService: AcademicoService) {}

  /** Boletim do aluno (médias, frequência e situação projetada). */
  @Get('alunos/:alunoId/boletim')
  boletim(@Param('alunoId') alunoId: string) {
    return this.academicoService.boletim(alunoId);
  }

  /** Aprova e promove um aluno individualmente (coordenação). */
  @Post('alunos/:alunoId/aprovar')
  @Roles(Role.COORDENACAO)
  @HttpCode(HttpStatus.OK)
  aprovar(@Param('alunoId') alunoId: string) {
    return this.academicoService.aprovarAluno(alunoId);
  }

  /** Encerra o ano letivo de uma turma, promovendo os aprovados (coordenação). */
  @Post('turmas/:turmaId/encerrar-ano')
  @Roles(Role.COORDENACAO)
  @HttpCode(HttpStatus.OK)
  encerrarAno(@Param('turmaId') turmaId: string) {
    return this.academicoService.encerrarAno(turmaId);
  }
}
