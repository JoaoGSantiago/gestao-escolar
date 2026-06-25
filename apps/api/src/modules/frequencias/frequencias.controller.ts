import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UpsertFrequenciaDto } from './dto/upsert-frequencia.dto';
import { FrequenciasService } from './frequencias.service';

@Controller('frequencias')
export class FrequenciasController {
  constructor(private readonly frequenciasService: FrequenciasService) {}

  // POST e PUT compartilham a mesma lógica de upsert (criar/atualizar).
  @Post()
  registrar(@Body() dto: UpsertFrequenciaDto) {
    return this.frequenciasService.registrar(dto);
  }

  @Put()
  atualizar(@Body() dto: UpsertFrequenciaDto) {
    return this.frequenciasService.registrar(dto);
  }

  @Get()
  findAll(
    @Query('alunoId') alunoId?: string,
    @Query('disciplinaId') disciplinaId?: string,
  ) {
    return this.frequenciasService.findAll({ alunoId, disciplinaId });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.frequenciasService.findOne(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.frequenciasService.remove(id);
  }
}
