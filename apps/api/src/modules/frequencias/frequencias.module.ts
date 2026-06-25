import { Module } from '@nestjs/common';
import { FrequenciasController } from './frequencias.controller';
import { FrequenciasService } from './frequencias.service';
import { PrismaFrequenciasRepository } from './repositories/prisma-frequencias.repository';
import { FREQUENCIAS_REPOSITORY } from './repositories/frequencias.repository';

@Module({
  controllers: [FrequenciasController],
  providers: [
    FrequenciasService,
    { provide: FREQUENCIAS_REPOSITORY, useClass: PrismaFrequenciasRepository },
  ],
  exports: [FrequenciasService],
})
export class FrequenciasModule {}
