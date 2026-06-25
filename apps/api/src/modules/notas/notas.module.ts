import { Module } from '@nestjs/common';
import { NotasController } from './notas.controller';
import { NotasService } from './notas.service';
import { PrismaNotasRepository } from './repositories/prisma-notas.repository';
import { NOTAS_REPOSITORY } from './repositories/notas.repository';

@Module({
  controllers: [NotasController],
  providers: [
    NotasService,
    { provide: NOTAS_REPOSITORY, useClass: PrismaNotasRepository },
  ],
  exports: [NotasService],
})
export class NotasModule {}
