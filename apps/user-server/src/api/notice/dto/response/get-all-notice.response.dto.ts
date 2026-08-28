import { NoticeOverviewEntity } from '../../entity/notice-overview.entity';

export class GetAllNoticeResponseDto {
  /**
   * 다음 페이지 존재 여부
   *
   * @example true
   */
  hasNext: boolean;

  /**
   * 공지사항 목록 data
   */
  noticeList: NoticeOverviewEntity[];
}
