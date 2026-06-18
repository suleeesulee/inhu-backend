import { NaverMenu } from '@libs/common/modules/naver-menu/naver-menu';
import { HttpService } from '@nestjs/axios';
import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isAxiosError } from 'axios';
import { createNaverMenuInternalHeaders } from './internal-naver-menu-auth.util';

@Injectable()
export class NaverMenuWorkerService {
  private readonly WORKER_BASE_URL: string;
  private readonly INTERNAL_SECRET: string;
  private readonly REQUEST_TIMEOUT_MS: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.WORKER_BASE_URL =
      this.configService.get<string>('naverMenuWorker.baseUrl') || '';
    this.INTERNAL_SECRET =
      this.configService.get<string>('naverMenuWorker.internalSecret') || '';
    this.REQUEST_TIMEOUT_MS =
      Number(
        this.configService.get<string>('naverMenuWorker.requestTimeoutMs'),
      ) || 60000;
  }

  public isEnabled(): boolean {
    return Boolean(this.WORKER_BASE_URL && this.INTERNAL_SECRET);
  }

  public async extractNaverMenu(naverPlaceId?: string): Promise<NaverMenu[]> {
    if (!this.isEnabled()) {
      throw new ServiceUnavailableException('Naver menu worker is disabled');
    }

    try {
      const { data } = await this.httpService.axiosRef.post<NaverMenu[]>(
        `${this.WORKER_BASE_URL}/internal/naver-menu/crawling`,
        { naverPlaceId },
        {
          headers: createNaverMenuInternalHeaders(
            this.INTERNAL_SECRET,
            naverPlaceId,
          ),
          timeout: this.REQUEST_TIMEOUT_MS,
        },
      );

      return data;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new ServiceUnavailableException(
          `Naver menu worker request failed: ${error.message}`,
        );
      }

      throw error;
    }
  }
}
