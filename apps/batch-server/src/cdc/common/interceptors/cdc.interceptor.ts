import { DiscordWebhookContext } from '@libs/common/modules/discord-webhook/constants/discord-webhook-context.enum';
import { DiscordWebhookService } from '@libs/common/modules/discord-webhook/discord-webhook.service';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { KafkaContext } from '@nestjs/microservices';
import { catchError, Observable, of } from 'rxjs';
import { inspect } from 'util';

@Injectable()
export class CdcInterceptor implements NestInterceptor {
  constructor(private readonly discordService: DiscordWebhookService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const kafkaCtx = context.switchToRpc().getContext<KafkaContext>();
    const msg = kafkaCtx.getMessage();

    return next.handle().pipe(
      catchError(async (err) => {
        const topic = kafkaCtx.getTopic();
        await this.discordService.alertError(
          `CDC - ${topic} Error`,
          `
Kafka Message
\`\`\`
${inspect(msg, { depth: null })}
\`\`\``,
          err,
          DiscordWebhookContext.BATCH_SERVER,
        );

        return of(null);
      }),
    );
  }
}
