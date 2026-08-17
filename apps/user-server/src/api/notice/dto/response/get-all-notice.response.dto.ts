import { NoticeOverviewEntity } from '../../entity/notice-overview.entity';

export class GetAllNoticeResponseDto {
  noticeList: NoticeOverviewEntity[];
  count: number;
}
