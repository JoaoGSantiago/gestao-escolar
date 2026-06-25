import { Module } from '@nestjs/common';
import { AlunosController } from './alunos.controller';
import { AlunosService } from './alunos.service';
import { PrismaAlunosRepository } from './repositories/prisma-alunos.repository';
import { ALUNOS_REPOSITORY } from './repositories/alunos.repository';

@Module({
  controllers: [AlunosController],
  providers: [
    AlunosService,
    { provide: ALUNOS_REPOSITORY, useClass: PrismaAlunosRepository },
  ],
  exports: [AlunosService],
})
export class AlunosModule {}
