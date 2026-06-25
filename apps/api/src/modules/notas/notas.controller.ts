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
import { CreateNotaDto } from './dto/create-nota.dto';
import { UpdateNotaDto } from './dto/update-nota.dto';
import { NotasService } from './notas.service';

@Controller('notas')
export class NotasController {
  constructor(private readonly notasService: NotasService) {}

  @Post()
  registrar(@Body() dto: CreateNotaDto) {
    return this.notasService.registrar(dto);
  }

  @Get()
  findAll(
    @Query('alunoId') alunoId?: string,
    @Query('disciplinaId') disciplinaId?: string,
  ) {
    return this.notasService.findAll({ alunoId, disciplinaId });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notasService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateNotaDto) {
    return this.notasService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.notasService.remove(id);
  }
}
