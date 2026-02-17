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

  public async getFreeTagByContent(
    content: string,
  ): Promise<FreeTagModel | null> {
    const freeTag =
      await this.freeTagCoreRepository.selectFreeTagByContent(content);
    return freeTag && FreeTagModel.fromPrisma(freeTag);
  }

  public async getFreeTagAll(contentList?: string[]): Promise<FreeTagModel[]> {
    const freeTagList =
      await this.freeTagCoreRepository.selectFreeTagAllByContent(contentList);
    return freeTagList.map(FreeTagModel.fromPrisma);
  }

  public async createFreeTag(content: string): Promise<FreeTagModel> {
    const freeTag = await this.freeTagCoreRepository.insertFreeTag(content);
    return FreeTagModel.fromPrisma(freeTag);
  }

  public async createManyFreeTag(
    contentList: string[],
  ): Promise<FreeTagModel[]> {
    const freeTagList =
      await this.freeTagCoreRepository.insertManyFreeTag(contentList);
    return freeTagList.map(FreeTagModel.fromPrisma);
  }

  public async deleteFreeTagByIdx(idx: number): Promise<void> {
    await this.freeTagCoreRepository.softDeleteFreeTagByIdx(idx);
  }
}
