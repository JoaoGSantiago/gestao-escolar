import { Module } from '@nestjs/common';
import { AcademicoController } from './academico.controller';
import { AcademicoService } from './academico.service';
import { PrismaAcademicoRepository } from './repositories/prisma-academico.repository';
import { ACADEMICO_REPOSITORY } from './repositories/academico.repository';

@Module({
  controllers: [AcademicoController],
  providers: [
    AcademicoService,
    { provide: ACADEMICO_REPOSITORY, useClass: PrismaAcademicoRepository },
  ],
  exports: [AcademicoService],
})
export class AcademicoModule {}
