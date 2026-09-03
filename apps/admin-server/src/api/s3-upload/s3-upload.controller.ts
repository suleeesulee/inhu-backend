import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { S3UploadService } from '@admin/api/s3-upload/s3-upload.service';
import { AdminAuth } from '@admin/common/decorator/admin-auth.decorator';
import { CreateBannerImagePresignedUrlDto } from '@admin/api/s3-upload/dto/request/create-banner-image-presigned-url.dto';
import { PresignedUrlEntity } from '@admin/api/s3-upload/entity/presigned-url.entity';
import { CreatePlaceImagePresignedUrlsDto } from '@admin/api/s3-upload/dto/request/create-place-image-presigned-url.dto';
import { ApiBadRequestResponse, ApiTags } from '@nestjs/swagger';
import { CreateMagazineImagePresignedUrlsDto } from './dto/request/create-magazine-image-presigned-url.dto';
import { AdminRole } from '../auth/admin-role.enum';
import { CreateProfileImagePresignedUrlDto } from './dto/request/create-profile-image-presigned-url.dto';
import { CreateReviewImagePresignedUrlsDto } from './dto/request/create-review-image-presigned-url.dto';
import { CreateRewardImagePresignedUrlDto } from './dto/request/create-reward-image-presigned-url.dto';
import { CreateUserRewardImagePresignedUrlsDto } from './dto/request/create-user-reward-image-presigned-url.dto';
import { PrivatePresignedUrlEntity } from './entity/private-presigned-url.entity';

@Controller('s3-upload')
@ApiTags('s3-upload')
export class S3UploadController {
  constructor(private readonly s3UploadService: S3UploadService) {}

  /**
   * 배너 이미지 Presigned URL 생성
   */
  @Post('/banner-image/presigned-url')
  @HttpCode(201)
  @ApiBadRequestResponse({
    description:
      '- extension field is not provided\n' +
      '- extension is not in IMAGE_EXTENSION type\n',
  })
  @AdminAuth()
  async createBannerImagePresignedUrl(
    @Body() createBannerImagePresignedUrlDto: CreateBannerImagePresignedUrlDto,
  ): Promise<PresignedUrlEntity> {
    return this.s3UploadService.createBannerImagePresignedUrl(
      createBannerImagePresignedUrlDto,
    );
  }

  /**
   * 메뉴 이미지 Presigned URL 생성
   */
  @Post('/menu-image/presigned-url')
  @HttpCode(201)
  @ApiBadRequestResponse({
    description:
      '- extension field is not provided\n' +
      '- extension is not in IMAGE_EXTENSION type\n',
  })
  @AdminAuth()
  async createMenuImagePresignedUrl(
    @Body() createMenuImagePresignedUrlDto: CreateBannerImagePresignedUrlDto,
  ): Promise<PresignedUrlEntity> {
    return this.s3UploadService.createMenuImagePresignedUrl(
      createMenuImagePresignedUrlDto,
    );
  }

  /**
   * 장소 이미지 Presigned URL 생성
   */
  @Post('/place-image/presigned-urls')
  @HttpCode(201)
  @ApiBadRequestResponse({
    description:
      '- extension field is not provided\n' +
      '- extension is not in IMAGE_EXTENSION type\n' +
      '- extensions array is empty\n' +
      '- extensions array contains an invalid extension\n' +
      '- extensions array exceeds max size',
  })
  @AdminAuth()
  async createPlaceImagePresignedUrls(
    @Body() createPlaceImagePresignedUrlsDto: CreatePlaceImagePresignedUrlsDto,
  ): Promise<PresignedUrlEntity[]> {
    return this.s3UploadService.createPlaceImagePresignedUrls(
      createPlaceImagePresignedUrlsDto,
    );
  }

  /**
   * magazine 이미지 Presigned URL 생성
   */
  @Post('/magazine-image/presigned-urls')
  @HttpCode(201)
  @ApiBadRequestResponse({
    description:
      '- extension field is not provided\n' +
      '- extension is not in IMAGE_EXTENSION type\n' +
      '- extensions array is empty\n' +
      '- extensions array contains an invalid extension\n' +
      '- extensions array exceeds max size',
  })
  @AdminAuth(AdminRole.MagazineAdmin)
  async createMagazineImagePresignedUrls(
    @Body()
    createMagazineImagePresignedUrlsDto: CreateMagazineImagePresignedUrlsDto,
  ): Promise<PresignedUrlEntity[]> {
    return this.s3UploadService.createMagazineImagePresignedUrls(
      createMagazineImagePresignedUrlsDto,
    );
  }

  /**
   * 프로필 이미지 Presigned URL 생성
   */
  @Post('/profile-image/presigned-url')
  @HttpCode(201)
  @ApiBadRequestResponse({
    description:
      '- extension field is not provided\n' +
      '- extension is not in IMAGE_EXTENSION type\n',
  })
  @AdminAuth(AdminRole.SuperAdmin)
  async createProfileImagePresignedUrl(
    @Body()
    createProfileImagePresignedUrlDto: CreateProfileImagePresignedUrlDto,
  ): Promise<PresignedUrlEntity> {
    return this.s3UploadService.createProfileImagePresignedUrl(
      createProfileImagePresignedUrlDto,
    );
  }

  /**
   * 리뷰 이미지 업로드 Presigned URL 생성
   */
  @Post('/review-image/presigned-urls')
  @HttpCode(201)
  @ApiBadRequestResponse({
    description:
      '- extension field is not provided\n' +
      '- extension is not in IMAGE_EXTENSION type\n' +
      '- extensions array is empty\n' +
      '- extensions array contains an invalid extension\n' +
      '- extensions array exceeds max size',
  })
  @AdminAuth(AdminRole.SuperAdmin)
  async createReviewImagePresignedUrls(
    @Body()
    dto: CreateReviewImagePresignedUrlsDto,
  ): Promise<PresignedUrlEntity[]> {
    return this.s3UploadService.createReviewImagePresignedUrls(dto);
  }

  /**
   * 리워드 이미지 Presigned URL 생성
   */
  @Post('/reward-image/presigned-url')
  @HttpCode(201)
  @AdminAuth()
  async createRewardImagePresignedUrl(
    @Body() dto: CreateRewardImagePresignedUrlDto,
  ): Promise<PresignedUrlEntity> {
    return this.s3UploadService.createRewardImagePresignedUrl(dto);
  }

  /**
   * 사용자 리워드 기프티콘 이미지 Private Presigned URL 생성
   */
  @Post('/user-reward-image/presigned-urls')
  @HttpCode(201)
  @AdminAuth()
  async createUserRewardImagePresignedUrls(
    @Body() dto: CreateUserRewardImagePresignedUrlsDto,
  ): Promise<PrivatePresignedUrlEntity[]> {
    return (
      await this.s3UploadService.createUserRewardImagePresignedUrls(dto)
    ).map(PrivatePresignedUrlEntity.fromModel);
  }
}
