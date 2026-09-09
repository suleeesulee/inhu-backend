import { UniqueArray } from '@libs/common/decorator/unique-array.decorator';
import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class IssueUserRewardDto {
  /**
   * 리워드 발급 메일 내용
   *
   * @example "리워드 상품을 발급해 드립니다."
   */
  @IsNotEmpty()
  @IsString()
  content: string;

  /**
   * 리워드 발급 이미지 경로 목록
   *
   * @example ["/user-reward/c37409c8-11b4-4c24-b2c5-3747aad1b846.png"]
   */
  @UniqueArray()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(5)
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  imagePathList: string[];
}
