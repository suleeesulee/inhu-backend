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
      page.setDefaultTimeout(this.PUPPETEER_SELECTOR_TIMEOUT);
      return await callback(page);
    } finally {
      await browser.close();
    }
  }
}
