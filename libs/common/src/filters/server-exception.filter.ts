import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request } from 'express';
import { DiscordWebhookService } from '../modules/discord-webhook/discord-webhook.service';
import { DiscordWebhookContext } from '../modules/discord-webhook/constants/discord-webhook-context.enum';
import { MetricService } from '../modules/metric/metric.service';

@Catch()
export class ServerExceptionsFilter extends BaseExceptionFilter {
  constructor(
    private readonly discordWebhookService: DiscordWebhookService,
    private readonly metricService: MetricService,
  ) {
    super();
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const labels = {
      controller: 'GlobalFilter',
      handler: request.url,
      method: request.method,
      error: status.toString(),
    };
    this.metricService.incrementFailureCounter(labels);

    if (status >= 500) {
      const envServiceName = process.env.SERVICE_NAME;
      let webhookContext: DiscordWebhookContext = DiscordWebhookContext.UNKNOWN;

      if (
        Object.values(DiscordWebhookContext).includes(
          envServiceName as DiscordWebhookContext,
        )
      ) {
        webhookContext = envServiceName as DiscordWebhookContext;
      }

      const errorObj =
        exception instanceof Error ? exception : new Error(String(exception));
      const message = `Path: [${request.method}] ${request.url}`;

      this.discordWebhookService
        .sendErrorMessage(
          `[${status}] 서버 에러 발생`,
          message,
          errorObj,
          webhookContext,
        )
        .catch((err) => {
          console.log('Discord Webhook Error:', err.message);
        });
    }

    super.catch(exception, host);
  }
}
