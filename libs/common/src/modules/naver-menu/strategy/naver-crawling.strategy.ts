import { Page } from 'puppeteer';
import { NaverMenu } from '../naver-menu';

export abstract class NaverCrawlingStrategy {
  public abstract crawl(page: Page): Promise<NaverMenu[]>;
}
