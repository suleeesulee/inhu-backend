import { IsNotEmpty, IsUrl } from 'class-validator';

export class MenuCrawlingDto {
  /**
   * 네이버 플레이스 메뉴 페이지 URL 혹은 네이버 플레이스 홈 페이지 URL
   *
   * @example "https://map.naver.com/p/search/%ED%88%AC%EC%8D%B8%ED%94%8C%EB%A0%88%EC%9D%B4%EC%8A%A4/place/33928724?placePath=/menu?entry=pll&fromPanelNum=2&timestamp=202511191744&locale=ko&svcName=map_pcv5&searchText=%ED%88%AC%EC%8D%B8%ED%94%8C%EB%A0%88%EC%9D%B4%EC%8A%A4&fromPanelNum=2&timestamp=202511191744&locale=ko&svcName=map_pcv5&searchText=%ED%88%AC%EC%8D%B8%ED%94%8C%EB%A0%88%EC%9D%B4%EC%8A%A4&from=nx&fromNxList=true&searchType=place&c=15.00,0,0,0,dh"
   */
  @IsNotEmpty()
  @IsUrl()
  url: string;
}
