import { Module } from '@nestjs/common';
import { LogPrismaService } from './log-prisma.service';

/**
 * Log Prisma 모듈
 *
 * @publicApi
 */
@Module({
  providers: [LogPrismaService],
  exports: [LogPrismaService],
})
export class LogPrismaModule {}
