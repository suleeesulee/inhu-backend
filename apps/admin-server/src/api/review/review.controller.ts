import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { AdminAuth } from '@admin/common/decorator/admin-auth.decorator';
import { GetAllReviewResponseDto } from './dto/response/get-all-review.reponse.dto';
import { GetAllReviewDto } from './dto/request/get-all-review.dto';
import { Exception } from '@libs/common/decorator/exception.decorator';
import { ReviewEntity } from './entity/review.entity';
import { AdminRole } from '../auth/admin-role.enum';
import { ApiTags } from '@nestjs/swagger';
import { CreateReviewDto } from './dto/request/create-review.dto';
import { UpdateReviewDto } from './dto/request/update-review.dto';

@Controller()
@ApiTags('Review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  /**
   * 리뷰 삭제하기 API
   *
   * @author 강정연
   */
  @Delete('/review/:reviewIdx')
  @AdminAuth()
  @Exception(400, 'Invalid reviewIdx')
  @Exception(404, 'Place does not exist')
  async deleteReview(
    @Param('reviewIdx', ParseIntPipe) reviewIdx: number,
  ): Promise<void> {
    await this.reviewService.deleteReviewByIdx(reviewIdx);
  }

  /**
   * 리뷰 목록 가져오기 API
   *
   * @author 강정연
   */
  @Get('/review/all')
  @AdminAuth()
  @Exception(400, 'Query parameter type is invalid')
  @Exception(403, 'Permission denied')
  async getAllReview(
    @Query() dto: GetAllReviewDto,
  ): Promise<GetAllReviewResponseDto> {
    return await this.reviewService.getAllReview(dto);
  }

  /**
   * 리뷰 자세히보기 API
   */
  @Get('/review/:idx')
  @AdminAuth()
  @Exception(400, 'Invalid reviewIdx')
  @Exception(404, 'Review does not exist')
  async getReviewByIdx(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<ReviewEntity> {
    return await this.reviewService.getReviewByIdx(idx);
  }

  /**
   * 리뷰 생성하기
   *
   * @author jochong
   */
  @Post('/place/:placeIdx')
  @AdminAuth(AdminRole.SuperAdmin)
  @Exception(400, 'Invalid place idx or body')
  @Exception(403, 'Permission Denied')
  @Exception(404, 'place does not exist')
  async createReview(
    @Param('placeIdx', ParseIntPipe) placeIdx: number,
    @Body() dto: CreateReviewDto,
  ): Promise<ReviewEntity> {
    return await this.reviewService.createReview(placeIdx, dto.userIdx, dto);
  }

  /**
   * 리뷰 수정하기
   *
   * @author jochong
   */
  @Put('/review/:idx')
  @Exception(400, 'Invalid review idx or body')
  @Exception(403, 'Permission Denied')
  @Exception(404, 'place does not exist')
  async updateReview(
    @Param('idx', ParseIntPipe) reviewIdx: number,
    @Body() dto: UpdateReviewDto,
  ) {
    return await this.reviewService.updateReviewByIdx(reviewIdx, dto);
  }
}
