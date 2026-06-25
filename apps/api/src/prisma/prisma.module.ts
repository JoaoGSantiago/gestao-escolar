import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * Módulo global: disponibiliza o PrismaService a toda a aplicação
 * sem necessidade de reimportá-lo em cada módulo de domínio.
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
