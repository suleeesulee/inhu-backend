import { IsEnumValue } from '@libs/common/decorator/is-enum-value.decorator';
import { IsKoreanDate } from '@libs/common/decorator/is-korean-date.decorator';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

enum InhaTechTarget {
  STUDENT = '학생',
  EMPLOYEE = '교직원',
}

export class CrawlingFoodStationDto {
  /**
   * 크롤링할 식당 사이트 url
   *
   * @example 'https://www.inha.ac.kr/kr/1072/subview.do'
   */
  @IsNotEmpty()
  @IsUrl()
  url: string;

  /**
   * 인하 공전 학생식당/교직원 식당 크롤링을 위한 필드
   *
   * - 학생식당: "학생"
   * - 교직원 식당: "교직원"
   * @example '학생'
   */
  @IsOptional()
  @IsEnumValue(InhaTechTarget)
  target?: InhaTechTarget;

  /**
   * 인하 공전 학생식당/교직원 식당 크롤링을 위한 필드
   * - **주의** 인하공전은 시작날짜가 일요일이므로 시작날짜는 일요일로 설정해야 합니다.
   *
   * @example '2026-04-19'
   */
  @IsOptional()
  @IsString()
  @IsKoreanDate()
  startDate?: string;

  /**
   * 인하 공전 학생식당/교직원 식당 크롤링을 위한 필드
   * - **주의** 인하 공전은 마지막날짜가 토요일이므로 마지막날짜는 토요일로 설정해야 합니다.
   *
   * @example '2026-04-25'
   */
  @IsOptional()
  @IsString()
  @IsKoreanDate()
  endDate?: string;
}
