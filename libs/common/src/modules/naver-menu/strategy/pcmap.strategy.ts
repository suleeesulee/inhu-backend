import { Page } from 'puppeteer';
import { NaverCrawlingStrategy } from './naver-crawling.strategy';
import { Injectable, NotFoundException } from '@nestjs/common';
import { NaverMenu } from '../naver-menu';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PcmapStrategy extends NaverCrawlingStrategy {
  private readonly selectors: {
    liSelector: string;
    expandButtonSelector: string;
    nameSelector: string;
    priceSelector: string;
    contentSelector: string;
    imageSelector: string;
  };

  constructor(private readonly configService: ConfigService) {
    super();
    this.selectors = this.configService.get('naverMenu.pcmap') || {
      liSelector: 'li.E2jtL',
      expandButtonSelector: 'a.fvwqf',
      nameSelector: 'span.lPzHi',
      priceSelector: 'div.GXS1X > em',
      contentSelector: 'div.okI98',
      imageSelector: 'img.K0PDV',
    };
  }

  public async crawl(page: Page, timeout: number): Promise<NaverMenu[]> {
    await this.expandAllMenus(page, timeout);

    const selector = this.selectors;
    const liSelector = selector.liSelector;
    try {
      await page.waitForSelector(liSelector, {
        timeout,
      });
    } catch (error) {
      throw new NotFoundException(
        `크롤링 타임아웃: 셀렉터('${liSelector}')를 찾지 못했습니다.`,
      );
    }

    return await page.$$eval(
      liSelector,
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
  private async expandAllMenus(page: Page, timeout: number): Promise<void> {
    const selector = this.selectors.expandButtonSelector;

    try {
      await page.waitForSelector(selector, {
        timeout,
      });
    } catch (error) {
      console.log('더이상 더보기 버튼이 존재하지 않아 넘어갑니다.');
    }

    let btn = await page.$(selector);

    while (btn) {
      await btn.click();
      await new Promise((resolve) => setTimeout(resolve, 100));
      btn = await page.$(selector);
    }
  }
}
