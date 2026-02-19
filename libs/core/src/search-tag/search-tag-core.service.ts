import { Injectable } from '@nestjs/common';
import { SearchTagCoreRepository } from './search-tag-core.repository';
import { SearchTagModel } from './model/search-tag.model';

@Injectable()
export class SearchTagCoreService {
  constructor(
    private readonly searchTagCoreRepository: SearchTagCoreRepository,
  ) {}

  public async getSearchTagByIdx(idx: number): Promise<SearchTagModel | null> {
    const searchTag =
      await this.searchTagCoreRepository.selectSearchTagByIdx(idx);
    return searchTag && SearchTagModel.fromPrisma(searchTag);
  }

  public async getSearchTagByContent(
    content: string,
  ): Promise<SearchTagModel | null> {
    const searchTag =
      await this.searchTagCoreRepository.selectSearchTagByContent(content);
    return searchTag && SearchTagModel.fromPrisma(searchTag);
  }

  public async getSearchTagAll(
    contentList?: string[],
  ): Promise<SearchTagModel[]> {
    const searchTagList =
      await this.searchTagCoreRepository.selectSearchTagAllByContent(
        contentList,
      );
    return searchTagList.map(SearchTagModel.fromPrisma);
  }

  public async createSearchTag(content: string): Promise<SearchTagModel> {
    const searchTag =
      await this.searchTagCoreRepository.insertSearchTag(content);
    return SearchTagModel.fromPrisma(searchTag);
  }

  public async createManySearchTag(
    contentList: string[],
  ): Promise<SearchTagModel[]> {
    const searchTagList =
      await this.searchTagCoreRepository.insertManySearchTag(contentList);
    return searchTagList.map(SearchTagModel.fromPrisma);
  }

  public async deleteSearchTagByIdx(idx: number): Promise<void> {
    await this.searchTagCoreRepository.softDeleteSearchTagByIdx(idx);
  }
}
