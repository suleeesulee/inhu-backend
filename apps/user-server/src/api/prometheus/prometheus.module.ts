import { MetricModule } from '@libs/common/modules/metric/metric.module';
import { Module } from '@nestjs/common';
import { PrometheusApiController } from './prometheus.controller';

@Module({
  imports: [MetricModule],
  controllers: [PrometheusApiController],
})
export class PrometheusApiModule {}
