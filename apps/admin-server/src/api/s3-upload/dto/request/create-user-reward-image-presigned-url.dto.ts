import { IsEnumValue } from '@libs/common/decorator/is-enum-value.decorator';
import { ImageExtension } from '@libs/common/modules/s3/constants/image-extension.constants';
import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsArray,
  IsString,
} from 'class-validator';

/**
 * User Reward Image의 Presigned URL 여러개 생성을 위한 입력 값
 */
export class CreateUserRewardImagePresignedUrlsDto {
  /**
   * 업로드할 파일의 확장자명
   *
   * @example ["jpg", "png"]
   */
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsEnumValue(ImageExtension, { each: true })
  @ArrayMaxSize(5)
  extensions: ImageExtension[];
}
