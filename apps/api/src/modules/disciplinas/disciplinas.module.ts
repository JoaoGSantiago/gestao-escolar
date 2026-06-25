import { Module } from '@nestjs/common';
import { DisciplinasController } from './disciplinas.controller';
import { DisciplinasService } from './disciplinas.service';
import { PrismaDisciplinasRepository } from './repositories/prisma-disciplinas.repository';
import { DISCIPLINAS_REPOSITORY } from './repositories/disciplinas.repository';

@Module({
  controllers: [DisciplinasController],
  providers: [
    DisciplinasService,
    { provide: DISCIPLINAS_REPOSITORY, useClass: PrismaDisciplinasRepository },
  ],
  exports: [DisciplinasService],
})
export class DisciplinasModule {}
