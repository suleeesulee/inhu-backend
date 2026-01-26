import { Module } from '@nestjs/common';
import { PlaceCronModule } from './place-cron/place-cron.module';
import { ConfigModule } from '@nestjs/config';
import { ClsModule } from 'nestjs-cls';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { PrismaModule } from '@libs/common/modules/prisma/prisma.module';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { PrismaService } from '@libs/common/modules/prisma/prisma.service';
import { DiscordWebhookModule } from '@libs/common/modules/discord-webhook/discord-webhook.module';
import { ScheduleModule } from '@nestjs/schedule';
import { LogPrismaModule } from '@libs/common/modules/log-prisma/log-prisma.module';
import { LogPrismaService } from '@libs/common/modules/log-prisma/log-prisma.service';
import { CdcModule } from './cdc/cdc.module';
import { LOG_PRISMA_KEY } from '@libs/common/modules/log-prisma/LOG_PRISMA_KEY';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PlaceCronModule,
    ClsModule.forRoot({
      plugins: [
        new ClsPluginTransactional({
          imports: [PrismaModule],
          adapter: new TransactionalAdapterPrisma({
            prismaInjectionToken: PrismaService,
            sqlFlavor: 'postgresql',
          }),
        }),
        new ClsPluginTransactional({
          connectionName: LOG_PRISMA_KEY,
          imports: [LogPrismaModule],
          adapter: new TransactionalAdapterPrisma({
            prismaInjectionToken: LogPrismaService,
            sqlFlavor: 'postgresql',
          }),
        }),
      ],
    }),
    CdcModule,
    DiscordWebhookModule,
    ScheduleModule.forRoot(),
  ],
})
export class BatchServerModule {}
