import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import mailConfig from './config/mail.config';
import { MailService } from './mail.service';

@Module({
  imports: [
    ConfigModule.forFeature(mailConfig),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          transport: {
            service: 'gmail',
            auth: {
              user: config.get<string>('mail.user'),
              pass: config.get<string>('mail.pass'),
            },
          },
        };
      },
    }),
  ],
  controllers: [],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
