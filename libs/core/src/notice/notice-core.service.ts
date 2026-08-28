import { Injectable } from '@nestjs/common';
import { NoticeCoreRepository } from './notice-core.repository';
import { NoticeModel } from './model/notice.model';
import { NoticeOverviewModel } from './model/notice-overview.model';
import { CreateNoticeInput } from './inputs/create-notice.input';
import { UpdateNoticeInput } from './inputs/update-notice.input';
import { GetAllNoticeInput } from './inputs/get-all-notice.input';

/**
 * @publicApi
 */
@Injectable()
export class NoticeCoreService {
  constructor(
    private readonly noticeCoreRepository: NoticeCoreRepository,
  ) {}

  /**
   * idx로 공지사항 조회
   */
  public async getNoticeByIdx(idx: number): Promise<NoticeModel | null> {
    const notice = await this.noticeCoreRepository.selectNoticeByIdx(idx);

    return notice && NoticeModel.fromPrisma(notice);
  }

  /**
   * 모든 공지사항 조회 (최신순)
   */
  public async getNoticeAll(
    input: GetAllNoticeInput,
  ): Promise<NoticeOverviewModel[]> {
    return (await this.noticeCoreRepository.selectNoticeAll(input)).map(
      NoticeOverviewModel.fromPrisma,
    );
  }

  /**
   * 공지사항 개수 조회
   */
  public async getNoticeCount(): Promise<number> {
    return await this.noticeCoreRepository.selectNoticeCount();
  }

  /**
   * 공지사항 생성
   */
  public async createNotice(input: CreateNoticeInput): Promise<NoticeModel> {
    return NoticeModel.fromPrisma(
      await this.noticeCoreRepository.insertNotice(input),
    );
  }

  /**
   * 공지사항 수정
   */
  public async updateNoticeByIdx(
    idx: number,
    input: UpdateNoticeInput,
  ): Promise<void> {
    await this.noticeCoreRepository.updateNoticeByIdx(idx, input);
  }

  /**
   * 공지사항 삭제
   */
  public async deleteNoticeByIdx(idx: number): Promise<void> {
    await this.noticeCoreRepository.deleteNoticeByIdx(idx);
  }
}
