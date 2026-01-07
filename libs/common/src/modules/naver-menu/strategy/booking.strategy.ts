import { Page } from 'puppeteer';
import { NaverCrawlingStrategy } from './naver-crawling.strategy';
import { NaverMenu } from '../naver-menu';
import { NotFoundException } from '@nestjs/common';

export class BookingStrategy extends NaverCrawlingStrategy {
  private readonly selectors = {
    rootDivSelector: 'div.user_app',
    liSelector: 'li[class^="MenuContent__order_list_item"]',
    nameSelector: 'div[class^="MenuContent__tit"]',
    priceSelector: 'div[class^="MenuContent__price"] strong',
    contentSelector: 'span.detail_txt',
    imageSelector: 'img[class^="MenuContent__img"]',
    tabBoxSelector: 'div[class^="SelectOrderType__tab_switch_box"]',
    tabItemSelector: 'a[role="tab"]',
  };

  public async crawl(page: Page, timeout: number): Promise<NaverMenu[]> {
    await this.showSoldOutMenus(page, timeout);

    try {
      await page.waitForSelector(this.selectors.rootDivSelector, {
        timeout,
      });
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

        await tab.click();

        const liSelector = this.selectors.liSelector;
        try {
          await page.waitForSelector(liSelector, {
            timeout,
          });
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

  private async showSoldOutMenus(page: Page, timeout: number): Promise<void> {
    const selector = 'i.fn-booking-check1';
    try {
      await page.waitForSelector(selector, {
        timeout,
      });
      await page.click(selector);
    } catch (err) {
      console.log('품절 메뉴 표시 버튼이 없어 넘어갑니다.');
    }
  }

  private async autoScroll(page: Page) {
    await page.evaluate(async () => {
      await new Promise<void>((resolve) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
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
