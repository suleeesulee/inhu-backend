import { NotificationPageType } from '../constants/notification-page-type.constant';

export class CreateNotificationInput {
  title: string;
  content: string;
  pageType: NotificationPageType;
}
