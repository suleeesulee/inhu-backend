import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Page } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import StealthPlugin = require('puppeteer-extra-plugin-stealth');

@Injectable()
export class PuppeteerService {
  private readonly PUPPETEER_CUSTOM_EXECUTABLE_PATH: string;
  private readonly PUPPETEER_SELECTOR_TIMEOUT: number;
  private readonly PUPPETEER_PROXY_SERVER: string;

  constructor(private readonly configService: ConfigService) {
    this.PUPPETEER_CUSTOM_EXECUTABLE_PATH =
      this.configService.get('puppeteer.customExecutablePath') || '';
    this.PUPPETEER_SELECTOR_TIMEOUT =
      this.configService.get('puppeteer.selectorTimeout') || 30000;
    this.PUPPETEER_PROXY_SERVER =
      this.configService.get('puppeteer.proxyServer') || '';

    puppeteer.use(StealthPlugin());
  }

  public async execute<T>(callback: (page: Page) => Promise<T>): Promise<T> {
    console.log(
      'puppeteer executable path:',
      this.PUPPETEER_CUSTOM_EXECUTABLE_PATH,
    );
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: this.PUPPETEER_CUSTOM_EXECUTABLE_PATH,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-gpu',
        '--no-zygote',
        `--proxy-server=${this.PUPPETEER_PROXY_SERVER}`,
      ],
    });

    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1920, height: 1080 });

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
