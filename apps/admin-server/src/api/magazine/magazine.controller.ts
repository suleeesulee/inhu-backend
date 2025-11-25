import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { MagazineService } from './magazine.service';
import { MagazineEntity } from './entity/magazine.entity';
import { CreateMagazineDto } from './dto/request/create-magazine.dto';
import { AdminAuth } from '@admin/common/decorator/admin-auth.decorator';
import { GetAllMagazineDto } from './dto/request/get-all-magazine.dto';
import { GetAllMagazineResponseDto } from './dto/response/get-all-magazine.response.dto';
import { Exception } from '@libs/common/decorator/exception.decorator';
import { ActivateMagazineByIdxDto } from './dto/request/activate-magazine-by-idx.dto';
import { UpdateMagazineByIdxDto } from './dto/request/update-magazine-by-idx.dto';
import { OpenAIService } from '@libs/common/modules/openAI/openAI.service';
import { RecommendDescriptionDto } from './dto/request/recommend-description.dto';
import { DescriptionRecommendResponseDto } from './dto/response/description-recommend.response.dto';
import { CreateMagazineCategoryDto } from './dto/request/create-magazine-category.dto';
import { UpdateMagazineCategoryDto } from './dto/request/update-magazine-category.dto';

@Controller('magazine')
export class MagazineController {
  constructor(
    private readonly magazineService: MagazineService,
    private readonly openAIService: OpenAIService,
  ) {}

  /**
   * 모든 매거진 조회
   *
   * @author 이수인
   */
  @AdminAuth()
  @Get('/all')
  @Exception(400, 'Invalid magazine request')
  public async getMagazineAll(
    @Query() dto: GetAllMagazineDto,
  ): Promise<GetAllMagazineResponseDto> {
    return await this.magazineService.getMagazineAll(dto);
  }

  /**
   * 매거진 자세히보기
   */
  @AdminAuth()
  @Get('/:idx')
  @Exception(400, 'Invalid path parameter')
  @Exception(404, 'Cannot find magazine')
  public async getMagazineByIdx(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<MagazineEntity> {
    return await this.magazineService.getMagazineByIdx(idx);
  }

  /**
   * 매거진 생성
   *
   * @author 이수인
   */
  @AdminAuth()
  @Post()
  @Exception(400, 'Invalid create magazine request')
  public async createMagazine(
    @Body() dto: CreateMagazineDto,
  ): Promise<MagazineEntity> {
    return await this.magazineService.createMagazine(dto);
  }

  /**
   * 매거진 활성화
   *
   * @author 이수인
   */
  @AdminAuth()
  @Post(':idx/activate')
  @Exception(400, 'Invalid magazine idx')
  @Exception(404, 'Magazine not found')
  @Exception(
    409,
    `- activate: true - Magazine is already activated
   - activate: false - Magazine is not activated`,
  )
  @HttpCode(200)
  public async activateMagazineByIdx(
    @Param('idx', ParseIntPipe) idx: number,
    @Body() dto: ActivateMagazineByIdxDto,
  ): Promise<void> {
    await this.magazineService.activateMagazineByIdx(idx, dto);
  }

  /**
   * 추천 소개말 생성
   *
   * @author 이수인
   */
  @AdminAuth()
  @Post('/description/recommend')
  public async recommendDescriptionWithOpenAI(
    @Body() dto: RecommendDescriptionDto,
  ): Promise<DescriptionRecommendResponseDto> {
    return await this.openAIService.recommendDescription(
      dto.title,
      dto.content,
      `https://inhu-files.s3.ap-northeast-2.amazonaws.com${dto.thumbnailImagePath}`,
      dto.prompt,
    );
  }

  /**
   * 특정 메거진 카테고리 생성
   */
  @AdminAuth()
  @Post('/:idx/category')
  @Exception(400, 'Invalid category idx')
  @Exception(404, 'Category not found')
  @HttpCode(200)
  public async createMagazineCategoryByIdx(
    @Param('idx', ParseIntPipe) idx: number,
    @Body() dto: CreateMagazineCategoryDto,
  ): Promise<void> {
    return await this.magazineService.createMagazineCategoryByIdx(idx, dto);
  }

  /**
   * 매거진 수정
   *
   * @author 이수인
   */
  @AdminAuth()
  @Put(':idx')
  @Exception(400, 'Invalid magazine idx')
  @Exception(404, 'Magazine not found')
  @HttpCode(200)
  public async updateMagazineByIdx(
    @Param('idx', ParseIntPipe) idx: number,
    @Body() dto: UpdateMagazineByIdxDto,
  ): Promise<void> {
    return await this.magazineService.updateMagazineByIdx(idx, dto);
  }

  /**
   * 특정 매거진 카테고리 수정
   */
  @AdminAuth()
  @Put('/:idx/category')
  @Exception(400, 'Invalid category idx')
  @Exception(404, 'Category not found')
  @HttpCode(200)
  public async updateMagazineCategoryByIdx(
    @Param('idx', ParseIntPipe) idx: number,
    @Body() dto: UpdateMagazineCategoryDto,
  ): Promise<void> {
    return await this.magazineService.updateMagazineCategoryByIdx(idx, dto);
  }

  /**
   * 매거진 삭제
   *
   * @author 이수인
   */
  @AdminAuth()
  @Delete(':idx')
  @Exception(400, 'Invalid magazine idx')
  @Exception(404, 'Magazine not found')
  public async deleteMagazineByIdx(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<void> {
    await this.magazineService.deleteMagazineByIdx(idx);
  }
}
