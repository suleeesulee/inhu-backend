import { ReviewCoreService } from '@libs/core/review/review-core.service';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GetAllReviewDto } from './dto/request/get-all-review.dto';
import { ReviewEntity } from './entity/review.entity';
import { CreateReviewDto } from './dto/request/create-review.dto';
import { ManagedUserCoreService } from '@libs/core/user/managed-user-core.service';
import { UpdateReviewDto } from './dto/request/update-review.dto';
import { PlaceCoreService } from '@libs/core/place/place-core.service';

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewCoreService: ReviewCoreService,
    private readonly managedUserCoreService: ManagedUserCoreService,
    private readonly placeCoreService: PlaceCoreService,
  ) {}

  async deleteReviewByIdx(reviewIdx: number): Promise<void> {
    await this.reviewCoreService.deleteReviewByIdx(reviewIdx);
  }

  public async getAllReview(dto: GetAllReviewDto): Promise<{
    reviewList: ReviewEntity[];
    hasNext: boolean;
    totalCount: number;
  }> {
    const pageSize = 10;
    const take = pageSize + 1;
    const skip = (dto.page - 1) * pageSize;

    const reviewModelList = await this.reviewCoreService.getAllReview({
      take,
      skip,
      ...dto,
    });
    const totalCount = await this.reviewCoreService.getAllReviewCount({
      take,
      skip,
      ...dto,
    });

    return {
      reviewList: reviewModelList
        .slice(0, pageSize)
        .map((review) => ReviewEntity.fromModel(review)),
      totalCount,
      hasNext: reviewModelList.length > pageSize,
    };
  }

  public async getReviewByIdx(idx: number): Promise<ReviewEntity> {
    const review = await this.reviewCoreService.getReviewByIdx(idx);

    if (!review) {
      throw new NotFoundException('Cannot find review');
    }

    return ReviewEntity.fromModel(review);
  }

  public async createReview(
    placeIdx: number,
    userIdx: number,
    dto: Omit<CreateReviewDto, 'userIdx'>,
  ): Promise<ReviewEntity> {
    const managedUser =
      await this.managedUserCoreService.getManagedUserByIdx(userIdx);

    if (!managedUser) {
      throw new ForbiddenException('Permission Denied');
    }

    const place = await this.placeCoreService.getPlaceByIdx(placeIdx);

    if (!place) {
      throw new NotFoundException('Place not found');
    }

    const review = await this.reviewCoreService.createReviewByPlaceIdx(
      placeIdx,
      userIdx,
      {
        content: dto.content,
        imagePathList: dto.imagePathList,
        keywordIdxList: dto.keywordIdxList,
      },
    );

    return ReviewEntity.fromModel(review);
  }

  public async updateReviewByIdx(
    idx: number,
    dto: UpdateReviewDto,
  ): Promise<void> {
    const review = await this.reviewCoreService.getReviewByIdx(idx);

    if (!review) {
      throw new NotFoundException('Cannot find review');
    }

    const user = await this.managedUserCoreService.getManagedUserByIdx(
      review.author.idx,
    );

    if (!user) {
      throw new ForbiddenException('Permission Denied');
    }

    await this.reviewCoreService.updateReviewByIdx(idx, dto);
  }
}
