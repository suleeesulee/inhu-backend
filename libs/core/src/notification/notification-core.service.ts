import { Injectable } from '@nestjs/common';
import { CreateNotificationInput } from './inputs/create-notification.input';
import { GetNotificationAllInput } from './inputs/get-notification-all.input';
import { UpdateNotificationCampaignInput } from './inputs/update-notification-campaign.input';
import { NotificationCampaignModel } from './model/notification-campaign.model';
import { NotificationModel } from './model/notification.model';
import { LoginUserNotificationModel } from './model/login-user-notification.model';
import { NotificationCoreRepository } from './notification-core.repository';

/**
 * 알림 코어 서비스
 *
 * @publicApi
 */
@Injectable()
export class NotificationCoreService {
  constructor(
    private readonly notificationCoreRepository: NotificationCoreRepository,
  ) {}

  public async getNotificationById(
    id: string,
  ): Promise<NotificationModel | null> {
    const notification =
      await this.notificationCoreRepository.selectNotificationById(id);

    return notification && NotificationModel.fromPrisma(notification);
  }

  public async getNotificationAll(
    input: GetNotificationAllInput,
  ): Promise<NotificationModel[]> {
    return (
      await this.notificationCoreRepository.selectNotificationAll(input)
    ).map(NotificationModel.fromPrisma);
  }

  public async getNotificationCount(): Promise<number> {
    return await this.notificationCoreRepository.selectNotificationCount();
  }

  public async createNotification(
    input: CreateNotificationInput,
  ): Promise<NotificationModel> {
    return NotificationModel.fromPrisma(
      await this.notificationCoreRepository.insertNotification(input),
    );
  }

  public async getLoginUserNotificationAllByUserIdx(
    userIdx: number,
    input: GetNotificationAllInput,
  ): Promise<LoginUserNotificationModel[]> {
    return (
      await this.notificationCoreRepository.selectLoginUserNotificationAllByUserIdx(
        userIdx,
        input,
      )
    ).map(LoginUserNotificationModel.fromPrisma);
  }

  public async getLoginUserNotificationCountByUserIdx(
    userIdx: number,
  ): Promise<number> {
    return await this.notificationCoreRepository.selectLoginUserNotificationCountByUserIdx(
      userIdx,
    );
  }

  public async createLoginUserNotificationAll(
    notificationId: string,
    userIdxList: number[],
  ): Promise<void> {
    await this.notificationCoreRepository.insertLoginUserNotificationAll(
      notificationId,
      userIdxList,
    );
  }

  public async getNotificationCampaignById(
    id: string,
  ): Promise<NotificationCampaignModel | null> {
    const campaign =
      await this.notificationCoreRepository.selectNotificationCampaignById(id);

    return campaign && NotificationCampaignModel.fromPrisma(campaign);
  }

  public async createNotificationCampaign(
    notificationId: string,
  ): Promise<NotificationCampaignModel> {
    return NotificationCampaignModel.fromPrisma(
      await this.notificationCoreRepository.insertNotificationCampaign(
        notificationId,
      ),
    );
  }

  public async updateNotificationCampaignById(
    id: string,
    input: UpdateNotificationCampaignInput,
  ): Promise<NotificationCampaignModel> {
    return NotificationCampaignModel.fromPrisma(
      await this.notificationCoreRepository.updateNotificationCampaignById(
        id,
        input,
      ),
    );
  }
}
