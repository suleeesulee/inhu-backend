import { Injectable, NotFoundException } from '@nestjs/common';
import puppeteer, { Page } from 'puppeteer';
import { NaverMenu } from './naver-menu';
import { ConfigService } from '@nestjs/config';
import { PcmapStrategy } from './strategy/pcmap.strategy';
import { BookingStrategy } from './strategy/booking.strategy';
import { NaverCrawlingStrategy } from './strategy/naver-crawling.strategy';

@Injectable()
export class NaverMenuService {
  private readonly PUPPETEER_CUSTOM_EXECUTABLE_PATH: string;
  private readonly PUPPETEER_SELECTOR_TIMEOUT: number;
  private readonly strategyMap: Record<string, NaverCrawlingStrategy>;
  private readonly NAVER_MENU_DIV_SELECTOR: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly pcmapStrategy: PcmapStrategy,
    private readonly bookingStrategy: BookingStrategy,
  ) {
    this.PUPPETEER_CUSTOM_EXECUTABLE_PATH =
      this.configService.get<string>('naverMenu.executablePath') || '';
    this.PUPPETEER_SELECTOR_TIMEOUT =
      this.configService.get<number>('naverMenu.selectorTimeout') || 30000;
    this.strategyMap = {
      'pcmap.place.naver.com': this.pcmapStrategy,
      'm.booking.naver.com': this.bookingStrategy,
    };
    this.NAVER_MENU_DIV_SELECTOR =
      this.configService.get<string>('naverMenu.menuDivSelector') || '';
  }

  public async extractNaverMenu(naverPlaceId?: string): Promise<NaverMenu[]> {
    const url = new URL(
      `https://pcmap.place.naver.com/restaurant/${naverPlaceId}`,
    ).toString();

    const browser = await puppeteer.launch({
      headless: 'shell',
      executablePath: this.PUPPETEER_CUSTOM_EXECUTABLE_PATH,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-gpu',
        '--no-zygote',
      ],
    });
    const page = await browser.newPage();

    try {
      await this.gotoNaverPlacePage(url, page);

      await this.waitForSelectorWithTimeout(
        page,
        '#app-root',
        this.PUPPETEER_SELECTOR_TIMEOUT,
      );

      try {
        const menuSelector = this.NAVER_MENU_DIV_SELECTOR;
        await this.waitForSelectorWithTimeout(page, menuSelector, 5000);
        await page.click(menuSelector);
      } catch (error) {
        console.log('메뉴가 존재하지 않습니다.');
        await browser.close();
        return [];
      }

      const strategy = this.strategyMap[new URL(page.url()).hostname];
      if (!strategy) {
        throw new NotFoundException('지원하지 않는 네이버 메뉴 페이지입니다.');
      }

      return await strategy.crawl(page, this.PUPPETEER_SELECTOR_TIMEOUT);
    } finally {
      await browser.close();
    }
  }

  /**
   * 네이버 플레이스 페이지로 이동하는 메서드.
   * 이동에 실패하면 NotFoundException을 던집니다.
   */
  private async gotoNaverPlacePage(url: string, page: Page) {
    try {
      await page.goto(url);
    } catch (error) {
      throw new NotFoundException('네이버 메뉴 페이지 이동에 실패했습니다.');
    }
  }

  /**
   * 특정 셀렉터가 로드될 때까지 대기하는 메서드.
   * 타임아웃이 발생하면 NotFoundException을 던집니다.
   */
  private async waitForSelectorWithTimeout(
    target: Page,
    selector: string,
    timeout: number,
  ) {
    try {
      await target.waitForSelector(selector, { timeout });
    } catch (error) {
      throw new NotFoundException(
        `크롤링 타임아웃: 셀렉터('${selector}')를 찾지 못했습니다.`,
      );
    }
  }
}
