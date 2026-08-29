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
            host: config.get<string>('mail.host'),
            port: config.get<number>('mail.port'),
            secure: false,
            requireTLS: true,
            auth: {
              user: config.get<string>('mail.user'),
              pass: config.get<string>('mail.pass'),
            },
          },
          defaults: {
            from: {
              name: '인하밥길',
              address: 'service@inhu.co.kr',
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
