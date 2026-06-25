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
import { CreateProfessorDto } from './dto/create-professor.dto';
import { UpdateProfessorDto } from './dto/update-professor.dto';
import { ProfessoresService } from './professores.service';

@Controller('professores')
export class ProfessoresController {
  constructor(private readonly professoresService: ProfessoresService) {}

  @Post()
  @Roles(Role.COORDENACAO)
  create(@Body() dto: CreateProfessorDto) {
    return this.professoresService.create(dto);
  }

  @Get()
  findAll() {
    return this.professoresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.professoresService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.COORDENACAO)
  update(@Param('id') id: string, @Body() dto: UpdateProfessorDto) {
    return this.professoresService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.COORDENACAO)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.professoresService.remove(id);
  }
}
