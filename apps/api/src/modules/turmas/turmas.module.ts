import { Module } from '@nestjs/common';
import { PrismaTurmasRepository } from './repositories/prisma-turmas.repository';
import { TURMAS_REPOSITORY } from './repositories/turmas.repository';
import { TurmasController } from './turmas.controller';
import { TurmasService } from './turmas.service';

@Module({
  controllers: [TurmasController],
  providers: [
    TurmasService,
    { provide: TURMAS_REPOSITORY, useClass: PrismaTurmasRepository },
  ],
  exports: [TurmasService],
})
export class TurmasModule {}
