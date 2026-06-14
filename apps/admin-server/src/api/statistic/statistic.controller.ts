import { CacheTTL, CacheKey } from '@nestjs/cache-manager';
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { DauStatisticEntity } from './entity/dau-statistic.entity';
import { ApiTags } from '@nestjs/swagger';
import { AdminAuth } from '@admin/common/decorator/admin-auth.decorator';
import { PageViewHistoryEntity } from './entity/page-view-history.entity';
import { DateAwareCacheInterceptor } from '@admin/common/interceptors/date-aware-cache.interceptor';

@Controller('statistic')
@ApiTags('Statistic')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  /**
   * 최근 한 달 DAU를 플랫폼별로 가져오는 API
   */
  @Get('/ga4/dau')
  @AdminAuth()
  @UseInterceptors(DateAwareCacheInterceptor)
  @CacheKey('statistic/dau-by-month')
  @CacheTTL(24 * 60 * 60 * 1000)
  public async getDauByMonth(): Promise<DauStatisticEntity[]> {
    return await this.statisticService.getDauByMonth();
  }

  /**
   * 페이지 조회수 통계를 가져오는 API
   */
  @Get('/ga4/page-view-history')
  @AdminAuth()
  @UseInterceptors(DateAwareCacheInterceptor)
  @CacheKey('statistic/page-view-history')
  @CacheTTL(24 * 60 * 60 * 1000)
  public async getPageViewHistory(): Promise<PageViewHistoryEntity[]> {
    return await this.statisticService.getPageViewHistory();
  }
}
