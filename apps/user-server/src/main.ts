import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { getMode } from '@libs/common/utils/get-mode.util';
import { DiscordWebhookService } from '@libs/common/modules/discord-webhook/discord-webhook.service';
import { DiscordWebhookContext } from '@libs/common/modules/discord-webhook/constants/discord-webhook-context.enum';
import * as swStats from 'swagger-stats';
import { AdminAccountCoreService } from '@libs/core/admin-account/admin-account-core.service';
import { HashService } from '@libs/common/modules/hash/hash.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
          `🚀 ${DiscordWebhookContext.USER_SERVER} 배포 알림 `,
          `서버가 성공적으로 배포 되었습니다.`,
          DiscordWebhookContext.USER_SERVER,
        );
    } catch (err) {
      // ! 주의: 에러가 발생해도 서버가 중단되지 않도록 하기 위해 console.log로 에러를 출력합니다.
      console.log(err);
    }
  }

  const config = new DocumentBuilder()
    .setTitle('Inhu API')
    .setDescription('Inhu API')
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

  app.use(
    swStats.getMiddleware({
      swaggerSpec: documentFactory,
      authentication: true,
      onAuthenticate: async (req, username, password) => {
        const admin = await app
          .get(AdminAccountCoreService)
          .getAdminAccountById(username);
        if (!admin) {
          return false;
        }

        const isPasswordValid = await app
          .get(HashService)
          .compare(password, admin.pw);
        if (isPasswordValid) {
          return true;
        }

        return false;
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
