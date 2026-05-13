import { MetricService } from '@libs/common/modules/metric/metric.service';
import { Controller, Get, Header } from '@nestjs/common';

@Controller('metrics')
export class PrometheusApiController {
  constructor(private readonly metricService: MetricService) {}

  @Get()
  @Header('Content-Type', 'text/plain')
  async getMetrics(): Promise<string> {
    return await this.metricService.getMetrics();
  }
}
