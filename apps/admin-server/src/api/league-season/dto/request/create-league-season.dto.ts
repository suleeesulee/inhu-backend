import { IsKoreanDate } from '@libs/common/decorator/is-korean-date.decorator';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateLeagueRewardOptionDto } from './create-league-reward-option.dto';
import { Type } from 'class-transformer';

export class CreateLeagueSeasonDto {
  /**
   * league season 이름
   *
   * @example '2026년 5월 세 번째 시즌'
   */
  @IsNotEmpty()
  @IsString()
  name: string;

  /**
   * 시작 날짜 (한국 날짜)
   *
   * @example '2026-08-03'
   */
  @IsString()
  @IsKoreanDate()
  startAt: string;

  /**
   * 종료 날짜 (한국 날짜)
   *
   * @example '2026-08-17'
   */
  @IsString()
  @IsKoreanDate()
  endAt: string;

  /**
   * 리그 시즌 보상 옵션 리스트
   */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLeagueRewardOptionDto)
  rewardOptionList: CreateLeagueRewardOptionDto[];
}
