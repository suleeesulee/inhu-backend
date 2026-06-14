import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AdminServerModule } from './admin-server.module';
import { getMode } from '@libs/common/utils/get-mode.util';
import { DiscordWebhookService } from '@libs/common/modules/discord-webhook/discord-webhook.service';
import { DiscordWebhookContext } from '@libs/common/modules/discord-webhook/constants/discord-webhook-context.enum';
import { Ga4Service } from '@libs/common/modules/ga4/ga4.service';

async function bootstrap() {
  const app = await NestFactory.create(AdminServerModule);

  app.enableShutdownHooks();

  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(' '),
    credentials: true,
  });

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  if (getMode() === 'production') {
    try {
      await app
        .get(DiscordWebhookService)
        .sendWebhookMessage(
          `🚀 ${DiscordWebhookContext.ADMIN_SERVER} 배포 알림 `,
          `서버가 성공적으로 배포 되었습니다.`,
          DiscordWebhookContext.ADMIN_SERVER,
        );
    } catch (err) {
      // ! 주의: 에러가 발생해도 서버가 중단되지 않도록 하기 위해 console.log로 에러를 출력합니다.
      console.log(err);
    }
  }

  if (getMode() === 'development') {
    const config = new DocumentBuilder()
      .setTitle('Inhu Back office API')
      .setDescription('Inhu Back office API')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const customOptions: SwaggerCustomOptions = {
      swaggerOptions: {
        persistAuthorization: true,
      },
    };
    const documentFactory = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory, customOptions);
  }

  await app.listen(process.env.ADMIN_SERVER_PORT ?? 3000);

  if (process.send) {
    process.send('ready');
  }
}
bootstrap();
