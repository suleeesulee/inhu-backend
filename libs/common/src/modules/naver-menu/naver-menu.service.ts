import { Injectable, NotFoundException } from '@nestjs/common';
import puppeteer, { Browser, Page } from 'puppeteer';
import { NaverMenu } from './naver-menu';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NaverMenuService {
  private readonly PUPPETEER_CUSTOM_EXECUTABLE_PATH: string;
  private readonly PUPPETEER_SELECTOR_TIMEOUT: number;

  constructor(private readonly configService: ConfigService) {
    this.PUPPETEER_CUSTOM_EXECUTABLE_PATH =
      this.configService.get<string>('naverMenu.executablePath') || '';
    this.PUPPETEER_SELECTOR_TIMEOUT =
      this.configService.get<number>('naverMenu.selectorTimeout') || 30000;
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

    await this.gotoNaverPlacePage(url, page, browser);

    await this.waitForSelectorWithTimeout(
      page,
      '#app-root',
      this.PUPPETEER_SELECTOR_TIMEOUT,
      browser,
    );

    try {
      const menuSelector = 'div.YYh8o.gHymq > a[href*="/menu"]';
      await this.waitForSelectorWithTimeout(page, menuSelector, 5000, browser);
      await page.click(menuSelector);
    } catch (error) {
      console.log('메뉴가 존재하지 않습니다.');
      await browser.close();
      return [];
    }

    const liSelector = 'li.E2jtL';
    await this.waitForSelectorWithTimeout(
      page,
      liSelector,
      this.PUPPETEER_SELECTOR_TIMEOUT,
      browser,
    );

    const expandButtonSelector = 'a.fvwqf';
    await this.expandMenuAll(page, expandButtonSelector);

    const menuItemList: NaverMenu[] = await page.$$eval(
      liSelector,
      (elements) => {
        const items: NaverMenu[] = [];

        for (const el of elements) {
          const nameEl = el.querySelector('span.lPzHi') as HTMLElement;
          const priceEl = el.querySelector('div.GXS1X > em') as HTMLElement;
          const contentEl = el.querySelector('div.kPogF') as HTMLElement;
          const imgEl = el.querySelector('img.K0PDV') as HTMLImageElement;

          const name = nameEl && nameEl.innerText.trim();
          const price =
            priceEl && parseInt(priceEl.innerText.trim().replace(/[,]/g, ''));
          const content = contentEl && contentEl.innerText.trim();
          const imagePath = imgEl && imgEl.src;

          if (name) {
            items.push({
              name,
              price,
              content,
              imagePath,
              isFlexible: price === null,
            });
          }
        }
        return items;
      },
    );

    await browser.close();
    return menuItemList;
  }

  /**
   * 네이버 플레이스 페이지로 이동하는 메서드.
   * 이동에 실패하면 브라우저를 종료하고 NotFoundException을 던집니다.
   */
  private async gotoNaverPlacePage(url: string, page: Page, browser: Browser) {
    try {
      await page.goto(url);
    } catch (error) {
      await browser.close();
      throw new NotFoundException('네이버 메뉴 페이지 이동에 실패했습니다.');
    }
  }

  /**
   * 특정 셀렉터가 로드될 때까지 대기하는 메서드.
   * 타임아웃이 발생하면 브라우저를 종료하고 NotFoundException을 던집니다.
   */
  private async waitForSelectorWithTimeout(
    target: Page,
    selector: string,
    timeout: number,
    browser: Browser,
  ) {
    try {
      await target.waitForSelector(selector, { timeout });
    } catch (error) {
      await browser.close();
      throw new NotFoundException(
        `크롤링 타임아웃: 셀렉터('${selector}')를 찾지 못했습니다.`,
      );
    }
  }

  /**
   * 메뉴 펼쳐서 더보기 버튼을 모두 클릭하는 메서드
   */
  private async expandMenuAll(target: Page, selector: string) {
    try {
      await target.waitForSelector(selector, {
        timeout: this.PUPPETEER_SELECTOR_TIMEOUT,
      });

      while (true) {
        const expandButton = await target.$(selector);

        if (expandButton) {
          await target.click(selector);
        } else {
          break;
        }
      }
    } catch (err) {
      console.log('추가 메뉴 더보기 버튼이 없어 넘어갑니다.');
    }
  }
}
