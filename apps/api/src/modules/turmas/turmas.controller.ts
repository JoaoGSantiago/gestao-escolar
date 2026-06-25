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
import { CreateTurmaDto } from './dto/create-turma.dto';
import { UpdateTurmaDto } from './dto/update-turma.dto';
import { TurmasService } from './turmas.service';

@Controller('turmas')
export class TurmasController {
  constructor(private readonly turmasService: TurmasService) {}

  @Post()
  @Roles(Role.COORDENACAO)
  create(@Body() dto: CreateTurmaDto) {
    return this.turmasService.create(dto);
  }

  @Get()
  findAll() {
    return this.turmasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.turmasService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.COORDENACAO)
  update(@Param('id') id: string, @Body() dto: UpdateTurmaDto) {
    return this.turmasService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.COORDENACAO)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.turmasService.remove(id);
  }
}
