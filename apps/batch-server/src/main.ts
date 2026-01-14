import { NestFactory } from '@nestjs/core';
import { BatchServerModule } from './batch-server.module';
import { getMode } from '@libs/common/utils/get-mode.util';
import { DiscordWebhookService } from '@libs/common/modules/discord-webhook/discord-webhook.service';
import { DiscordWebhookContext } from '@libs/common/modules/discord-webhook/constants/discord-webhook-context.enum';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { PrismaClient } from 'generated/log';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    BatchServerModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'batch-server',
          brokers: [process.env.KAFKA_HOST || ''],
        },
        consumer: {
          groupId: 'batch-server-consumer',
        },
      },
    },
  );

  if (getMode() === 'production') {
    try {
      const discordWebhookService = app.get(DiscordWebhookService);
      await discordWebhookService.sendWebhookMessage(
        `🚀 ${DiscordWebhookContext.BATCH_SERVER} 배포 알림`,
        `배치 서버가 성공적으로 시작되었습니다.`,
        DiscordWebhookContext.BATCH_SERVER,
      );
    } catch (err) {
      console.log(err);
    }
  }
  await app.listen();
}
bootstrap();
