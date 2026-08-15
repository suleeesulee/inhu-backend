import { IsEnumValue } from '@libs/common/decorator/is-enum-value.decorator';
import { ImageExtension } from '@libs/common/modules/s3/constants/image-extension.constants';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRewardImagePresignedUrlDto {
  /**
   * 업로드할 파일의 확장자명
   *
   * @example "jpg"
   */
  @IsNotEmpty()
  @IsString()
  @IsEnumValue(ImageExtension)
  public extension: ImageExtension;
}
