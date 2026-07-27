import { MagazineCoreService } from '@libs/core/magazine/magazine-core.service';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMagazineDto } from './dto/request/create-magazine.dto';
import { MagazineEntity } from './entity/magazine.entity';
import { GetAllMagazineResponseDto } from './dto/response/get-all-magazine.response.dto';
import { GetAllMagazineDto } from './dto/request/get-all-magazine.dto';
import { PlaceCoreService } from '@libs/core/place/place-core.service';
import { Transactional } from '@nestjs-cls/transactional';
import { MagazineNotFoundException } from '@admin/api/magazine/exception/MagazineNotFoundException';
import { MagazineOverviewEntity } from './entity/magazine-overview.entity';
import { GetAllMagazineInput } from '@libs/core/magazine/inputs/get-all-magazine.input';
import { ActivateMagazineByIdxDto } from './dto/request/activate-magazine-by-idx.dto';
import { UpdateMagazineByIdxDto } from './dto/request/update-magazine-by-idx.dto';
import { UpdateMagazineCategoryDto } from './dto/request/update-magazine-category.dto';
import { LoginAdmin } from '@admin/common/types/login-admin';
import { AdminRole } from '../auth/admin-role.enum';
import { RecommendDescriptionDto } from './dto/request/recommend-description.dto';
import { DescriptionRecommendResponseDto } from './dto/response/description-recommend.response.dto';
import { OpenAIService } from '@libs/common/modules/openAI/openAI.service';

@Injectable()
export class MagazineService {
  constructor(
    private readonly magazineCoreService: MagazineCoreService,
    private readonly placeCoreService: PlaceCoreService,
    private readonly openAIService: OpenAIService,
  ) {}

  public async getMagazineByIdx(idx: number): Promise<MagazineEntity> {
    const magazine = await this.magazineCoreService.getMagazineByIdx(idx);

    if (!magazine) {
      throw new MagazineNotFoundException('Cannot find magazine idx: ' + idx);
    }

    return MagazineEntity.fromModel(magazine);
  }

  public async getMagazineAll(
    dto: GetAllMagazineDto,
  ): Promise<GetAllMagazineResponseDto> {
    const input: GetAllMagazineInput = {
      take: 10,
      skip: (dto.page - 1) * 10,
      activated: dto.activated,
      pinned: dto.pinned,
    };

    return {
      magazineList: (await this.magazineCoreService.getMagazineAll(input)).map(
        MagazineOverviewEntity.fromModel,
      ),
      count: await this.magazineCoreService.getMagazineCount(input),
    };
  }

  @Transactional()
  public async createMagazine(
    dto: CreateMagazineDto,
    admin: LoginAdmin,
  ): Promise<MagazineEntity> {
    const extractedPlaceIdxList = this.extractAllPlaceIdxFromText(dto.content);
    const validPlaceList: number[] = [];

    if (extractedPlaceIdxList.length > 0) {
      validPlaceList.push(
        ...(await this.placeCoreService
          .getPlaceByIdxList(extractedPlaceIdxList)
          .then((places) => places.map((place) => place.idx))),
      );
    }

    return await this.magazineCoreService
      .createMagazine({
        authorIdx: admin.idx,
        title: dto.title,
        description: dto.description,
        content: dto.content,
        thumbnailImagePath: dto.thumbnailImagePath,
        isTitleVisible: dto.isTitleVisible,
        placeIdxList: validPlaceList,
      })
      .then(MagazineEntity.fromModel);
  }

  public async activateMagazineByIdx(
    idx: number,
    dto: ActivateMagazineByIdxDto,
    admin: LoginAdmin,
  ): Promise<void> {
    const isActivate = dto.activate;
    const magazine = await this.magazineCoreService.getMagazineByIdx(idx);

    if (!magazine) {
      throw new NotFoundException(`Magazine not found for idx: ${idx}`);
    }

    // if (
    //   admin.role === AdminRole.MagazineAdmin &&
    //   magazine.authorIdx !== admin.idx
    // ) {
    //   throw new ForbiddenException(
    //     `Admin idx: ${admin.idx} is not the author of magazine idx: ${idx}`,
    //   );
    // }

    if (isActivate && magazine.activatedAt) {
      throw new ConflictException(`Magazine is already activated: ${idx}`);
    }

    if (!isActivate && !magazine.activatedAt) {
      throw new ConflictException(`Magazine is not activated: ${idx}`);
    }

    await this.magazineCoreService.updateMagazineByIdx(idx, {
      activate: isActivate,
    });
  }

  public async recommendDescription(
    dto: RecommendDescriptionDto,
  ): Promise<DescriptionRecommendResponseDto> {
    const promptText = `
[데이터 정보]
- 제목: ${dto.title}
- 내용: ${dto.content.slice(0, 200)}
- 추가 요청: "${dto.prompt}"
    `.trim();

    const instructions = `
당신은 베테랑 매거진 에디터입니다.
주어진 [데이터 정보]와 [추가 요청사항]을 반영하여 매거진 소개글을 작성하세요.

[작성 규칙]
1. 핵심 요약: 제목과 내용의 핵심을 꿰뚫으면서도 이미지와 어울리는 문장을 만드세요.
2. 요청 반영: [추가 요청사항]에 적힌 내용을 적절히 반영하되, 내용의 사실관계를 왜곡하지 마세요.
3. 길이 제약: 공백 포함 50자 내외의 한 문장으로 작성하세요.
4. 언어: 자연스러운 한국어로 작성하세요.
5. 형식: 부연 설명 없이 완성된 문장 하나만 출력하세요.
    `.trim();

    return {
      description: await this.openAIService.completeWithImage<string>(
        promptText,
        `https://inhu-files.s3.ap-northeast-2.amazonaws.com/${dto.thumbnailImagePath}`,
        instructions,
      ),
    };
  }

  // ! 기존에 magazine admin인 경우 동일 인물만 수정하게 했는데 magazine admin이면 수정 가능하게 임시 변경함. 괜찮은 방법인지 고민할 필요있음
  public async updateMagazineByIdx(
    idx: number,
    dto: UpdateMagazineByIdxDto,
    admin: LoginAdmin,
  ): Promise<void> {
    const magazine = await this.magazineCoreService.getMagazineByIdx(idx);
    if (!magazine) {
      throw new NotFoundException(`Magazine not found for idx: ${idx}`);
    }

    // if (
    //   admin.role === AdminRole.MagazineAdmin &&
    //   magazine.authorIdx !== admin.idx
    // ) {
    //   throw new ForbiddenException(
    //     `Admin idx: ${admin.idx} is not the author of magazine idx: ${idx}`,
    //   );
    // }

    const extractedPlaceIdxList = this.extractAllPlaceIdxFromText(
      dto.content ?? magazine.content,
    );
    const validPlaceList: number[] = [];

    if (extractedPlaceIdxList.length > 0) {
      validPlaceList.push(
        ...(await this.placeCoreService
          .getPlaceByIdxList(extractedPlaceIdxList)
          .then((places) => places.map((place) => place.idx))),
      );
    }

    await this.magazineCoreService.updateMagazineByIdx(idx, {
      title: dto.title,
      description: dto.description,
      content: dto.content,
      thumbnailImagePath: dto.thumbnailImagePath,
      isTitleVisible: dto.isTitleVisible,
      placeIdxList: validPlaceList,
      activate: magazine.activatedAt ? true : false,
    });
  }

  public async updateMagazineCategoryByIdx(
    idx: number,
    dto: UpdateMagazineCategoryDto,
    admin: LoginAdmin,
  ): Promise<void> {
    const magazine = await this.magazineCoreService.getMagazineByIdx(idx);
    if (!magazine) {
      throw new NotFoundException(`Magazine not found for idx: ${idx}`);
    }

    // if (
    //   admin.role === AdminRole.MagazineAdmin &&
    //   magazine.authorIdx !== admin.idx
    // ) {
    //   throw new ForbiddenException(
    //     `Admin idx: ${admin.idx} is not the author of magazine idx: ${idx}`,
    //   );
    // }

    return await this.magazineCoreService.updateMagazineByIdx(idx, {
      ...dto,
      activate: magazine.activatedAt ? true : false,
    });
  }

  public async deleteMagazineByIdx(
    idx: number,
    admin: LoginAdmin,
  ): Promise<void> {
    const magazine = await this.magazineCoreService.getMagazineByIdx(idx);
    if (!magazine) {
      throw new NotFoundException(`Magazine not found for idx: ${idx}`);
    }

    // if (
    //   admin.role === AdminRole.MagazineAdmin &&
    //   magazine.authorIdx !== admin.idx
    // ) {
    //   throw new ForbiddenException(
    //     `Admin idx: ${admin.idx} is not the author of magazine idx: ${idx}`,
    //   );
    // }

    await this.magazineCoreService.deleteMagazineByIdx(idx);
  }

  private extractAllPlaceIdxFromText(bodyText: string): number[] {
    const regex = /:::place-(\d+):::/g;

    const matches = [...bodyText.matchAll(regex)];
    const idxList = matches.map((match) => parseInt(match[1], 10));

    return Array.from(new Set(idxList));
  }
}
