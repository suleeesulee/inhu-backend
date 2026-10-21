import { Page } from 'puppeteer';
import { NaverCrawlingStrategy } from './naver-crawling.strategy';
import { Injectable } from '@nestjs/common';
import { NaverMenu } from '../naver-menu';
import { ConfigService } from '@nestjs/config';
import { NaverMenuSelectorProfile } from '../config/menu-selector-profile';

type PcmapConfig = {
  profiles: NaverMenuSelectorProfile[];
  expandButtonSelector: string;
  expandTimeout: number;
};

@Injectable()
export class PcmapStrategy extends NaverCrawlingStrategy {
  private readonly profiles: NaverMenuSelectorProfile[];
  private readonly expandButtonSelector: string;
  private readonly expandTimeout: number;

  constructor(private readonly configService: ConfigService) {
    super();
    const config = this.configService.get<PcmapConfig>('naverMenu.pcmap');
    this.profiles = config?.profiles || [];
    this.expandButtonSelector = config?.expandButtonSelector || '';
    this.expandTimeout = config?.expandTimeout || 10000;
  }

  public async crawl(page: Page): Promise<NaverMenu[]> {
    const selector = await this.resolveSelectorProfile(
      page,
      this.profiles,
      'pcmap',
    );
    await this.expandAllMenus(
      page,
      selector.expandButtonSelector || this.expandButtonSelector,
    );

    return await page.$$eval(
      selector.liSelector,
      (elements, selector) => {
        const menuMap = new Map<string, NaverMenu>();

        for (const el of elements) {
          const nameEl = el.querySelector(selector.nameSelector) as HTMLElement;
          const priceEl = el.querySelector(
            selector.priceSelector,
          ) as HTMLElement;
          const contentEl = el.querySelector(
            selector.contentSelector,
          ) as HTMLElement;
          const imgEl = el.querySelector(
            selector.imageSelector,
          ) as HTMLImageElement;

          const name = nameEl && nameEl.innerText.trim();
          const price =
            priceEl && parseInt(priceEl.innerText.trim().replace(/[,]/g, ''));
          const content = contentEl && contentEl.innerText.trim();
          const imagePath = imgEl && imgEl.src;

          if (name) {
            menuMap.set(name, {
              name,
              price,
              content,
              imagePath,
              isFlexible: price === null,
            });
          }
        }
        return Array.from(menuMap.values());
      },
      selector as any,
    );
  }

  /**
   * 메뉴 펼쳐서 더보기 버튼을 모두 클릭하는 메서드
   */
  private async expandAllMenus(page: Page, selector: string): Promise<void> {
    if (!selector) {
      return;
    }

    try {
      await page.waitForSelector(selector, { timeout: this.expandTimeout });
    } catch (error) {
      console.log('더이상 더보기 버튼이 존재하지 않아 넘어갑니다.');
    }

    let btn = await page.$(selector);

    while (btn) {
      try {
        await btn.click();
        await this.randomDelay(400, 800);
        btn = await page.$(selector);
      } catch (err) {
        break;
      }
    }
  }
}
