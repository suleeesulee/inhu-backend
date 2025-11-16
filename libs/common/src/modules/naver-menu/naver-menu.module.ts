import { Module } from '@nestjs/common';
import { NaverMenuService } from './naver-menu.service';

@Module({
  providers: [NaverMenuService],
  exports: [NaverMenuService],
})
export class NaverMenuModule {}
