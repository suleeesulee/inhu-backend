import { CacheModule } from '@nestjs/cache-manager';
import { Ga4Module } from '@libs/common/modules/ga4/ga4.module';
import { Module } from '@nestjs/common';
import { StatisticController } from './statistic.controller';
import { StatisticService } from './statistic.service';
import { DateAwareCacheInterceptor } from '@admin/common/interceptors/date-aware-cache.interceptor';

@Module({
  imports: [Ga4Module, CacheModule.register()],
  controllers: [StatisticController],
  providers: [StatisticService, DateAwareCacheInterceptor],
  exports: [],
})
export class StatisticModule {}
