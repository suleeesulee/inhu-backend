import { Injectable } from '@nestjs/common';
import { FreeTagCoreRepository } from './free-tag-core.repository';
import { FreeTagModel } from './model/free-tag.model';

@Injectable()
export class FreeTagCoreService {
  constructor(private readonly freeTagCoreRepository: FreeTagCoreRepository) {}

  public async getFreeTagByIdx(idx: number): Promise<FreeTagModel | null> {
    const freeTag = await this.freeTagCoreRepository.selectFreeTagByIdx(idx);
    return freeTag && FreeTagModel.fromPrisma(freeTag);
  }

  public async getFreeTagAll(): Promise<FreeTagModel[]> {
    const freeTagList = await this.freeTagCoreRepository.selectFreeTagAll();
    return freeTagList.map(FreeTagModel.fromPrisma);
  }

  public async createFreeTag(content: string): Promise<FreeTagModel> {
    const freeTag = await this.freeTagCoreRepository.insertFreeTag(content);
    return FreeTagModel.fromPrisma(freeTag);
  }

  public async deleteFreeTagByIdx(idx: number): Promise<void> {
    await this.freeTagCoreRepository.softDeleteFreeTagByIdx(idx);
  }
}
