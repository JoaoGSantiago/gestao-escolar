import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { AlunosService } from './alunos.service';
import { CreateAlunoDto } from './dto/create-aluno.dto';
import { UpdateAlunoDto } from './dto/update-aluno.dto';

@Controller('alunos')
export class AlunosController {
  constructor(private readonly alunosService: AlunosService) {}

  @Post()
  @Roles(Role.COORDENACAO)
  create(@Body() dto: CreateAlunoDto) {
    return this.alunosService.create(dto);
  }

  @Get()
  findAll(@Query('turmaId') turmaId?: string) {
    return turmaId
      ? this.alunosService.findByTurma(turmaId)
      : this.alunosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.alunosService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.COORDENACAO)
  update(@Param('id') id: string, @Body() dto: UpdateAlunoDto) {
    return this.alunosService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.COORDENACAO)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.alunosService.remove(id);
  }
}
