import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import puppeteer, { Page } from 'puppeteer';

@Injectable()
export class PuppeteerService {
  private readonly PUPPETEER_CUSTOM_EXECUTABLE_PATH: string;
  private readonly PUPPETEER_SELECTOR_TIMEOUT: number;

  constructor(private readonly configService: ConfigService) {
    this.PUPPETEER_CUSTOM_EXECUTABLE_PATH =
      this.configService.get('puppeteer.customExecutablePath') || '';
    this.PUPPETEER_SELECTOR_TIMEOUT =
      this.configService.get('puppeteer.selectorTimeout') || 30000;
  }

  public async execute<T>(callback: (page: Page) => Promise<T>): Promise<T> {
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

    try {
      const page = await browser.newPage();
      await page.setUserAgent({
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      });
      page.on('console', (msg) =>
        console.log(`[BROWSER CONSOLE] ${msg.text()}`),
      );
      page.on('error', (err) => console.log(`[BROWSERCRASH] ${err.message}`));
      page.on('pageerror', (err) => console.log(`[BROWSERPAGE ERROR] ${err}`));
      page.setDefaultTimeout(this.PUPPETEER_SELECTOR_TIMEOUT);
      return await callback(page);
    } catch (err) {
      console.log(`[BROWSER ERROR] ${err.message}`);
      throw err;
    } finally {
      await browser.close();
    }
  }
}
