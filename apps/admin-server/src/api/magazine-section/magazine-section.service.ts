import { MagazineSectionCoreService } from '@libs/core/magazine-section/magazine-section-core.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { MagazineSectionEntity } from './entity/magazine-section.entity';
import { GetMagazineSectionAllResponseDto } from './dto/response/get-magazine-section-all.response.dto';
import { CreateMagazineSectionDto } from './dto/request/create-magazine-section.dto';
import { UpdateMagazineSectionDto } from './dto/request/update-magazine-section.dto';
import { PlaceSectionCoreService } from '@libs/core/place-section/place-section-core.service';

@Injectable()
export class MagazineSectionService {
  constructor(
    private readonly magazineSectionCoreService: MagazineSectionCoreService,
    private readonly placeSectionCoreService: PlaceSectionCoreService,
  ) {}

  public async getMagazineSectionAll(): Promise<GetMagazineSectionAllResponseDto> {
    return {
      magazineSectionEntityList: (
        await this.magazineSectionCoreService.getMagazineSectionAll()
      ).map((magazineSection) =>
        MagazineSectionEntity.fromModel(magazineSection),
      ),
    };
  }

  public async createMagazineSection(
    dto: CreateMagazineSectionDto,
  ): Promise<MagazineSectionEntity> {
    const magazineSectionCount =
      await this.magazineSectionCoreService.getMagazineSectionCount();
    const placeSectionCount =
      await this.placeSectionCoreService.getPlaceSectionCount();

    return await this.magazineSectionCoreService
      .createMagazineSection({
        ...dto,
        sortOrder: magazineSectionCount + placeSectionCount + 1,
      })
      .then(MagazineSectionEntity.fromModel);
  }

  public async updateMagazineSection(
    idx: number,
    dto: UpdateMagazineSectionDto,
  ): Promise<void> {
    const magazineSectionModel =
      await this.magazineSectionCoreService.getMagazineSectionByIdx(idx);
    if (!magazineSectionModel) {
      throw new NotFoundException(`MagazineSection with idx ${idx} not found`);
    }

    await this.magazineSectionCoreService.updateMagazineSectionByIdx(idx, dto);
  }

  public async deleteMagazineSection(idx: number): Promise<void> {
    const magazineSectionModel =
      await this.magazineSectionCoreService.getMagazineSectionByIdx(idx);
    if (!magazineSectionModel) {
      throw new NotFoundException(`MagazineSection with idx ${idx} not found`);
    }

    await this.magazineSectionCoreService.deleteMagazineSectionByIdx(idx);
  }
}
