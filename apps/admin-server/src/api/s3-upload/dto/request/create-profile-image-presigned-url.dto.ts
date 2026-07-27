import { IsEnumValue } from '@libs/common/decorator/is-enum-value.decorator';
import { ImageExtension } from '@libs/common/modules/s3/constants/image-extension.constants';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * Profile Image의 Presigned URL 생성을 위한 입력 값
 */
export class CreateProfileImagePresignedUrlDto {
  /**
   * 업로드할 파일의 확장자명
   *
   * @example "jpg"
   */
  @IsNotEmpty()
  @IsString()
  @IsEnumValue(ImageExtension)
  extension: ImageExtension;
}
