import { FoodStationCoreService } from '@libs/core/food-station/food-station-core.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FoodStationEntity } from './entity/food-station.entity';
import { GetFoodStationAllDto } from './dto/request/get-food-station-all.dto';
import { CafeteriaCoreService } from '@libs/core/cafeteria/cafeteria-core.service';
import { GetFoodStationAllResponseDto } from './dto/response/get-food-station-all.response.dto';
import { CreateFoodStationDto } from './dto/request/create-food-station.dto';
import { UpdateFoodStationDto } from './dto/request/update-food-station.dto';
import { OpenAIService } from '@libs/common/modules/openAI/openAI.service';
import { HttpService } from '@nestjs/axios';
import { PuppeteerService } from '@libs/common/modules/puppeteer/puppeteer.service';
import { CrawlingFoodStationDto } from './dto/request/crawlingFoodStation.dto';
import {
  getDormitoryInstruction,
  getInhaTechInstruction,
  getInhaUnivInstruction,
} from './constants/food-station-prompt.constant';

@Injectable()
export class FoodStationService {
  constructor(
    private readonly foodStationCoreService: FoodStationCoreService,
    private readonly cafeteriaCoreService: CafeteriaCoreService,
    private readonly httpService: HttpService,
    private readonly openAIService: OpenAIService,
    private readonly puppeteerService: PuppeteerService,
  ) {}

  public async getFoodStationAll(
    cafeteriaIdx: number,
    dto: GetFoodStationAllDto,
  ): Promise<GetFoodStationAllResponseDto> {
    const cafeteria =
      await this.cafeteriaCoreService.getCafeteriaByIdx(cafeteriaIdx);
    if (!cafeteria) {
      throw new NotFoundException('cafeteria not found');
    }

    return {
      foodStationList: (
        await this.foodStationCoreService.getFoodStationAll({
          cafeteriaIdx,
          ...dto,
        })
      ).map(FoodStationEntity.fromModel),
    };
  }

  public async createFoodStation(
    cafeteriaIdx: number,
    dto: CreateFoodStationDto,
  ): Promise<FoodStationEntity> {
    const cafeteria =
      await this.cafeteriaCoreService.getCafeteriaByIdx(cafeteriaIdx);
    if (!cafeteria) {
      throw new NotFoundException('cafeteria not found');
    }

    return FoodStationEntity.fromModel(
      await this.foodStationCoreService.createFoodStation({
        cafeteriaIdx,
        ...dto,
      }),
    );
  }

  public async crawlingFoodStation(
    cafeteriaIdx: number,
    dto: CrawlingFoodStationDto,
  ): Promise<FoodStationEntity[]> {
    const cafeteria =
      await this.cafeteriaCoreService.getCafeteriaByIdx(cafeteriaIdx);
    if (!cafeteria) {
      throw new NotFoundException('cafeteria not found');
    }

    if (cafeteriaIdx === 1 || cafeteriaIdx === 2) {
      return this.crawlingInhaUniv(cafeteriaIdx, dto.url);
    } else if (cafeteriaIdx === 3) {
      return this.crawlingDormitory(cafeteriaIdx, dto.url);
    } else if (cafeteriaIdx === 4 || cafeteriaIdx === 5) {
      return this.crawlingInhaTech(cafeteriaIdx, dto);
    } else {
      throw new NotFoundException('해당 식당은 크롤링이 지원되지 않습니다.');
    }
  }

  public async updateFoodStationByIdx(
    idx: number,
    dto: UpdateFoodStationDto,
  ): Promise<void> {
    const foodStation =
      await this.foodStationCoreService.getFoodStationByIdx(idx);
    if (!foodStation) {
      throw new NotFoundException('food station not found');
    }

    await this.foodStationCoreService.updateFoodStationByIdx(idx, dto);
  }

  public async deleteFoodStationByIdx(idx: number): Promise<void> {
    const foodStation =
      await this.foodStationCoreService.getFoodStationByIdx(idx);
    if (!foodStation) {
      throw new NotFoundException('food station not found');
    }

    await this.foodStationCoreService.deleteFoodStationByIdx(idx);
  }

  private async crawlingInhaUniv(
    cafeteriaIdx: number,
    url: string,
  ): Promise<FoodStationEntity[]> {
    return (
      await this.openAIService.complete<{
        stations: FoodStationEntity[];
      }>(
        `[식단표 HTML 데이터]\n${await this.extractHtmlData(url)}`,
        getInhaUnivInstruction(cafeteriaIdx),
      )
    ).stations;
  }

  private async crawlingDormitory(
    cafeteriaIdx: number,
    url: string,
  ): Promise<FoodStationEntity[]> {
    return (
      await this.openAIService.completeWithImage<{
        stations: FoodStationEntity[];
      }>(
        '첨부된 생활관 식단표 이미지에서 데이터를 추출해 주세요.',
        await this.extractImageSrc(url),
        getDormitoryInstruction(cafeteriaIdx),
      )
    ).stations;
  }

  private async crawlingInhaTech(
    cafeteriaIdx: number,
    dto: CrawlingFoodStationDto,
  ): Promise<FoodStationEntity[]> {
    const { gubun, strDate, endDate } = dto;
    if (!gubun || !strDate || !endDate) {
      throw new BadRequestException(
        '필수 파라미터(gubun, strDate, endDate)가 누락되었습니다.',
      );
    }

    const params = new URLSearchParams();
    params.append('gubun', gubun);
    params.append('strDate', strDate);
    params.append('endDate', endDate);

    const apiUrl = 'https://www.inhatc.ac.kr/haksa/kr/getHaksaFoodMenuList.do';
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      Referer: 'https://www.inhatc.ac.kr/haksa/kr/food.do',
      Origin: 'https://www.inhatc.ac.kr',
    };

    try {
      const { data } = await this.httpService.axiosRef.post(
        apiUrl,
        params.toString(),
        { headers },
      );
      const instructions = getInhaTechInstruction(cafeteriaIdx);

      const response = await this.openAIService.complete<{
        stations: FoodStationEntity[];
      }>(`[입력 데이터]\n${JSON.stringify(data)}`, instructions);

      return response.stations;
    } catch (err) {
      throw new NotFoundException('인하공전 식단 정보를 가져올 수 없습니다.');
    }
  }

  private async extractHtmlData(link: string) {
    return this.puppeteerService.execute(async (page) => {
      try {
        await page.goto(link);
      } catch (err) {
        throw new NotFoundException('해당 URL로 이동할 수 없습니다.');
      }

      const cleanedHtml = await page.evaluate(() => {
        const container = document.querySelector('#viewForm');
        if (!container) return '요소를 찾지 못했습니다.';

        const noise = container.querySelectorAll(
          'script, style, iframe, button, input',
        );
        noise.forEach((n) => n.remove());

        const allElements = container.querySelectorAll('*');
        allElements.forEach((el) => {
          const rowSpan = el.getAttribute('rowspan');
          const colSpan = el.getAttribute('colspan');

          while (el.attributes.length > 0) {
            el.removeAttribute(el.attributes[0].name);
          }

          if (rowSpan) el.setAttribute('rowspan', rowSpan);
          if (colSpan) el.setAttribute('colspan', colSpan);
        });

        return container.innerHTML
          .replace(/\s+/g, ' ')
          .replace(/>\s+</g, '><')
          .trim();
      });

      return cleanedHtml;
    });
  }

  private async extractImageSrc(link: string): Promise<string> {
    return this.puppeteerService.execute(async (page) => {
      try {
        await page.goto(link);
      } catch (err) {
        throw new NotFoundException('해당 URL로 이동할 수 없습니다.');
      }

      return await page.evaluate(() => {
        return (
          document.querySelector(
            '.artclView p:first-child img',
          ) as HTMLImageElement
        ).src;
      });
    });
  }
}
