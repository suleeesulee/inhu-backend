import { Page } from 'puppeteer';
import { NaverMenu } from '../naver-menu';
import { NotFoundException } from '@nestjs/common';
import { NaverMenuSelectorProfile } from '../config/menu-selector-profile';

export abstract class NaverCrawlingStrategy {
  protected async randomDelay(min: number, max: number): Promise<void> {
    const delayTime = Math.floor(Math.random() * (max - min + 1) + min);
    return new Promise((resolve) => setTimeout(resolve, delayTime));
  }

  protected async resolveSelectorProfile(
    page: Page,
    profiles: NaverMenuSelectorProfile[],
    strategyName: string,
  ): Promise<NaverMenuSelectorProfile> {
    if (profiles.length === 0) {
      throw new NotFoundException(
        `${strategyName} 메뉴 셀렉터 프로필이 설정되지 않았습니다.`,
      );
    }

    const anyLiSelector = profiles
      .map((profile) => profile.liSelector)
      .join(', ');

    try {
      await page.waitForSelector(anyLiSelector);
    } catch {
      throw new NotFoundException(
        `크롤링 타임아웃: ${strategyName} 메뉴 셀렉터 프로필을 찾지 못했습니다.`,
      );
    }

    for (const profile of profiles) {
      if (await page.$(profile.liSelector)) {
        return profile;
      }
    }

    throw new NotFoundException(
      `${strategyName} 메뉴 셀렉터 프로필을 찾지 못했습니다.`,
    );
  }

  public abstract crawl(page: Page): Promise<NaverMenu[]>;
}
