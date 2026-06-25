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
} from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { DisciplinasService } from './disciplinas.service';
import { CreateDisciplinaDto } from './dto/create-disciplina.dto';
import { UpdateDisciplinaDto } from './dto/update-disciplina.dto';

@Controller('disciplinas')
export class DisciplinasController {
  constructor(private readonly disciplinasService: DisciplinasService) {}

  @Post()
  @Roles(Role.COORDENACAO)
  create(@Body() dto: CreateDisciplinaDto) {
    return this.disciplinasService.create(dto);
  }

  @Get()
  findAll() {
    return this.disciplinasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.disciplinasService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.COORDENACAO)
  update(@Param('id') id: string, @Body() dto: UpdateDisciplinaDto) {
    return this.disciplinasService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.COORDENACAO)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.disciplinasService.remove(id);
  }
}
