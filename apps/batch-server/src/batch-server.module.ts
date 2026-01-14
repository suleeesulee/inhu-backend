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

@Module({
  imports: [
    ConfigModule.forRoot(),
    PlaceCronModule,
    ClsModule.forRoot({
      plugins: [
        new ClsPluginTransactional({
          connectionName: 'main-prisma',
          imports: [PrismaModule],
          adapter: new TransactionalAdapterPrisma({
            prismaInjectionToken: PrismaService,
            sqlFlavor: 'postgresql',
          }),
        }),
      ],
    }),
    ClsModule.forRoot({
      plugins: [
        new ClsPluginTransactional({
          connectionName: 'log-prisma',
          imports: [LogPrismaModule],
          adapter: new TransactionalAdapterPrisma({
            prismaInjectionToken: LogPrismaService,
            sqlFlavor: 'postgresql',
          }),
        }),
      ],
    }),
    DiscordWebhookModule,
    ScheduleModule.forRoot(),
  ],
})
export class BatchServerModule {}
