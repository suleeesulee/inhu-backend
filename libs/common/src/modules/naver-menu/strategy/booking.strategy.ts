import { Page } from 'puppeteer';
import { NaverCrawlingStrategy } from './naver-crawling.strategy';
import { NaverMenu } from '../naver-menu';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BookingStrategy extends NaverCrawlingStrategy {
  private readonly selectors: {
    rootDivSelector: string;
    liSelector: string;
    nameSelector: string;
    priceSelector: string;
    contentSelector: string;
    imageSelector: string;
    tabBoxSelector: string;
    tabItemSelector: string;
    soldOutSelector: string;
  };

  constructor(private readonly configService: ConfigService) {
    super();
    this.selectors = this.configService.get('naverMenu.booking') || {
      rootDivSelector: 'div.user_app',
      liSelector: 'li[class^="MenuContent__order_list_item"]',
      nameSelector: 'div[class^="MenuContent__tit"]',
      priceSelector: 'div[class^="MenuContent__price"] strong',
      contentSelector: 'span.detail_txt',
      imageSelector: 'img[class^="MenuContent__img"]',
      tabBoxSelector: 'div[class^="SelectOrderType__tab_switch_box"]',
      tabItemSelector: 'a[role="tab"]',
      soldOutSelector: 'i.fn-booking-check1',
    };
  }

  public async crawl(page: Page): Promise<NaverMenu[]> {
    await this.showSoldOutMenus(this.selectors.soldOutSelector, page);

    try {
      await page.waitForSelector(this.selectors.rootDivSelector);
    } catch (error) {
      throw new NotFoundException(
        `크롤링 타임아웃: 셀렉터('${this.selectors.rootDivSelector}')를 찾지 못했습니다.`,
      );
    }

    const tabBox = await page.$(`${this.selectors.tabBoxSelector}`);
    const hasTabs = tabBox !== null;

    const menuList: NaverMenu[] = [];
    if (hasTabs) {
      const tabs = await page.$$(
        `${this.selectors.tabBoxSelector} ${this.selectors.tabItemSelector}`,
      );
      for (const tab of tabs) {
        const tabText = await tab.evaluate((el) => el.textContent || '');

        if (tabText.includes('배달')) {
          continue;
        }

        await this.randomDelay(400, 800);
        await tab.click();

        const liSelector = this.selectors.liSelector;
        try {
          await page.waitForSelector(liSelector);
        } catch (error) {
          throw new NotFoundException(
            `크롤링 타임아웃: 셀렉터('${liSelector}')를 찾지 못했습니다.`,
          );
        }

        const menus = await this.extractMenusFromCurrentTabs(page);
        menuList.push(...menus);
      }
    } else {
      const menus = await this.extractMenusFromCurrentTabs(page);
      menuList.push(...menus);
    }
    return this.removeDuplicateMenu(menuList);
  }

  private async showSoldOutMenus(selector: string, page: Page): Promise<void> {
    try {
      const checkbox = await page.waitForSelector(selector, {
        visible: true,
      });

      if (checkbox) {
        await checkbox.evaluate((el) => el.scrollIntoView());
        await this.randomDelay(300, 700);
        await checkbox.click();
      }
    } catch (err) {
      console.log('품절 메뉴 표시 버튼이 없어 넘어갑니다.');
    }
  }

  private async autoScroll(page: Page) {
    await page.evaluate(async () => {
      await new Promise<void>((resolve) => {
        let totalHeight = 0;

        const scroll = () => {
          const distance = Math.floor(Math.random() * 100) + 50;
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            resolve();
          } else {
            const delay = Math.floor(Math.random() * 30) + 20;
            setTimeout(scroll, delay);
          }
        };

        scroll();
      });
    });
  }

  private async extractMenusFromCurrentTabs(page: Page): Promise<NaverMenu[]> {
    const selectors = this.selectors;
    await this.autoScroll(page);

    return await page.$$eval(
      selectors.liSelector,
      (elements, selector) => {
        const menuList: NaverMenu[] = [];

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
            menuList.push({
              name,
              price,
              content,
              imagePath,
              isFlexible: price === null,
            });
          }
        }
        return menuList;
      },
      selectors as any,
    );
  }

  private async removeDuplicateMenu(
    menuList: NaverMenu[],
  ): Promise<NaverMenu[]> {
    const menuMap = new Map<string, NaverMenu>();
    for (const menu of menuList) {
      if (!menuMap.has(menu.name)) {
        menuMap.set(menu.name, menu);
      }
    }
    return Array.from(menuMap.values());
  }
}
