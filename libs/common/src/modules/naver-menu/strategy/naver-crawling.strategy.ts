import { Page } from 'puppeteer';
import { NaverMenu } from '../naver-menu';

export abstract class NaverCrawlingStrategy {
  protected async randomDelay(min: number, max: number): Promise<void> {
    const delayTime = Math.floor(Math.random() * (max - min + 1) + min);
    return new Promise((resolve) => setTimeout(resolve, delayTime));
  }

  public abstract crawl(page: Page): Promise<NaverMenu[]>;
}
