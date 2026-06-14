import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Ga4Service {
  private readonly analyticsDataClient: BetaAnalyticsDataClient;
  private readonly PROPERTY_ID: string;

  constructor(private readonly configService: ConfigService) {
    this.PROPERTY_ID = this.configService.get('ga4').propertyId;
    const API_KEY_FILE_NAME = this.configService.get('ga4').apiKeyFileName;
    this.analyticsDataClient = new BetaAnalyticsDataClient(API_KEY_FILE_NAME);
  }

  /**
   * 최근 한달 동안의 Active 사용자 수를 보여주는 함수
   *
   * key: 날짜 (20260521)
   * value: { platform: 'iOS', value: '52'}
   */
  public async getDauByMonth() {
    const [response] = await this.analyticsDataClient.runReport({
      property: `properties/${this.PROPERTY_ID}`,
      dateRanges: [
        {
          startDate: '30daysAgo',
          endDate: 'today',
        },
      ],
      dimensions: [
        {
          name: 'date',
        },
        {
          name: 'platform',
        },
      ],
      metrics: [
        {
          name: 'activeUsers',
        },
      ],
    });

    const map = new Map<string, { platform: string; value: number }[]>();

    response.rows?.forEach(({ dimensionValues, metricValues }) => {
      if (!dimensionValues) return;

      const date = dimensionValues[0].value;
      const platform = dimensionValues[1].value;
      const metricCount = metricValues?.[0].value;

      if (!date || !platform || !metricCount) return;

      if (date && map.has(date)) {
        const value = map.get(date);

        value?.push({
          platform: platform,
          value: Number(metricCount),
        });
        return;
      }

      map.set(date, [{ platform, value: Number(metricCount) }]);
    });

    return map;
  }

  /**
   * 페이지 조회수
   */
  public async getScreenViewRankingByMonth() {
    const [response] = await this.analyticsDataClient.runReport({
      property: `properties/${this.PROPERTY_ID}`,
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'customEvent:screen_name' }],
      metrics: [{ name: 'eventCount' }],
      dimensionFilter: {
        filter: {
          fieldName: 'eventName',
          stringFilter: {
            matchType: 'EXACT',
            value: 'app_screen_view',
          },
        },
      },
      orderBys: [
        {
          metric: { metricName: 'eventCount' },
          desc: true,
        },
      ],
      limit: 100,
    });

    return response.rows?.map((row) => ({
      screenName: row.dimensionValues?.[0]?.value,
      count: Number(row.metricValues?.[0]?.value),
    }));
  }
}
