import { Injectable, NotFoundException } from '@nestjs/common';
import { Page } from 'puppeteer';
import { ConfigService } from '@nestjs/config';
import { PcmapStrategy } from './strategy/pcmap.strategy';
import { BookingStrategy } from './strategy/booking.strategy';
import { NaverCrawlingStrategy } from './strategy/naver-crawling.strategy';
import { PuppeteerService } from '../puppeteer/puppeteer.service';

@Injectable()
export class NaverMenuService {
  private readonly strategyMap: Record<string, NaverCrawlingStrategy>;
  private readonly NAVER_MENU_DIV_SELECTOR: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly pcmapStrategy: PcmapStrategy,
    private readonly bookingStrategy: BookingStrategy,
    private readonly puppeteerService: PuppeteerService,
  ) {
    this.strategyMap = {
      'pcmap.place.naver.com': this.pcmapStrategy,
      'm.booking.naver.com': this.bookingStrategy,
    };
    this.NAVER_MENU_DIV_SELECTOR =
      this.configService.get<string>('naverMenu.menuDivSelector') || '';
  }

  public async extractNaverMenu(naverPlaceId?: string) {
    return this.puppeteerService.execute(async (page) => {
      const url = new URL(
        `https://pcmap.place.naver.com/restaurant/${naverPlaceId}`,
      ).toString();
      console.log(`네이버 플레이스 페이지로 이동: ${url}`);

      await this.gotoNaverPlacePage(url, page);
      console.log('현재 페이지 URL:', page.url());

      await this.waitForSelectorWithTimeout(page, '#app-root');
      await new Promise((r) => setTimeout(r, 3000 + Math.random() * 2000));

      try {
        const menuSelector = this.NAVER_MENU_DIV_SELECTOR;
        await this.waitForSelectorWithTimeout(page, menuSelector);
        await new Promise((r) => setTimeout(r, 300 + Math.random() * 500));
        await page.click(menuSelector);
      } catch (error) {
        console.log('메뉴가 존재하지 않습니다.', error);
        return [];
      }
      console.log('현재 페이지 URL (메뉴 클릭 후):', page.url());

      const strategy = this.strategyMap[new URL(page.url()).hostname];
      if (!strategy) {
        throw new NotFoundException('지원하지 않는 네이버 메뉴 페이지입니다.');
      }

      return await strategy.crawl(page);
    });
  }

  /**
   * 네이버 플레이스 페이지로 이동하는 메서드.
   * 이동에 실패하면 NotFoundException을 던집니다.
   */
  private async gotoNaverPlacePage(url: string, page: Page) {
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded' });
    } catch (error) {
      throw new NotFoundException('네이버 메뉴 페이지 이동에 실패했습니다.');
    }
  }

  /**
   * 특정 셀렉터가 로드될 때까지 대기하는 메서드.
   * 타임아웃이 발생하면 NotFoundException을 던집니다.
   */
  private async waitForSelectorWithTimeout(target: Page, selector: string) {
    try {
      await target.waitForSelector(selector);
    } catch (error) {
      throw new NotFoundException(
        `크롤링 타임아웃: 셀렉터('${selector}')를 찾지 못했습니다.`,
      );
    }
  }
}
