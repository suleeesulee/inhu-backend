import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  OnModuleInit,
} from '@nestjs/common';
import { Counter, Gauge, Histogram, register } from 'prom-client';
import { catchError, Observable, tap } from 'rxjs';

@Injectable()
export class MetricInterceptor implements NestInterceptor, OnModuleInit {
  private readonly requestSuccessHistogram: Histogram<string>;
  private readonly requestFailHistogram: Histogram<string>;
  private readonly failureCounter: Counter<string>;

  constructor() {
    this.requestSuccessHistogram =
      (register.getSingleMetric(
        'nestjs_success_requests',
      ) as Histogram<string>) ||
      new Histogram({
        name: 'nestjs_success_requests',
        help: 'NestJs success requests - duration in seconds',
        labelNames: ['handler', 'controller', 'method'],
        buckets: [0.001, 0.01, 0.1, 0.5, 1, 2.5, 5, 10],
      });

    this.requestFailHistogram =
      (register.getSingleMetric('nestjs_fail_requests') as Histogram<string>) ||
      new Histogram({
        name: 'nestjs_fail_requests',
        help: 'NestJs fail requests - duration in seconds',
        labelNames: ['handler', 'controller', 'method'],
        buckets: [0.001, 0.01, 0.1, 0.5, 1, 2.5, 5, 10],
      });

    this.failureCounter =
      (register.getSingleMetric(
        'nestjs_requests_failed_count',
      ) as Counter<string>) ||
      new Counter({
        name: 'nestjs_requests_failed_count',
        help: 'NestJs requests that failed',
        labelNames: ['handler', 'controller', 'error', 'method'],
      });
  }

  onModuleInit() {
    this.requestSuccessHistogram.reset();
    this.requestFailHistogram.reset();
    this.failureCounter.reset();
  }

  private isAvailableMetricsUrl(url: string): boolean {
    return !url.includes('metrics');
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const request = http.getRequest();
    const originUrl = request.url.toString();
    const method = request.method.toString();

    const labels = {
      controller: context.getClass().name,
      handler: context.getHandler().name,
      method: method,
    };

    const stopSuccessTimer = this.requestSuccessHistogram.startTimer(labels);
    const stopFailTimer = this.requestFailHistogram.startTimer(labels);

    return next.handle().pipe(
      tap(() => {
        if (this.isAvailableMetricsUrl(originUrl)) {
          stopSuccessTimer();
        }
      }),
      catchError((err) => {
        if (this.isAvailableMetricsUrl(originUrl)) {
          stopFailTimer();
        }
        throw err;
      }),
    );
  }
}
