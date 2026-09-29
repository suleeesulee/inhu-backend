import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateNotificationInput } from './inputs/create-notification.input';
import { GetNotificationAllInput } from './inputs/get-notification-all.input';
import { UpdateNotificationCampaignInput } from './inputs/update-notification-campaign.input';
import {
  SELECT_NOTIFICATION,
  SelectNotification,
} from './model/prisma-type/select-notification';
import {
  SELECT_NOTIFICATION_CAMPAIGN,
  SelectNotificationCampaign,
} from './model/prisma-type/select-notification-campaign';
import {
  SELECT_LOGIN_USER_NOTIFICATION,
  SelectLoginUserNotification,
} from './model/prisma-type/select-login-user-notification';

@Injectable()
export class NotificationCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  public async selectNotificationById(
    id: string,
  ): Promise<SelectNotification | null> {
    return await this.txHost.tx.notification.findUnique({
      ...SELECT_NOTIFICATION,
      where: { id },
    });
  }

  public async selectNotificationAll(
    input: GetNotificationAllInput,
  ): Promise<SelectNotification[]> {
    return await this.txHost.tx.notification.findMany({
      ...SELECT_NOTIFICATION,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: input.take,
      skip: input.skip,
    });
  }

  public async selectNotificationAllForUser(
    input: GetNotificationAllInput,
  ): Promise<SelectNotification[]> {
    return await this.txHost.tx.notification.findMany({
      ...SELECT_NOTIFICATION,
      where: this.getNotificationWhere(input.userIdx),
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: input.take,
      skip: input.skip,
    });
  }

  public async selectNotificationCount(): Promise<number> {
    return await this.txHost.tx.notification.count();
  }

  public async insertNotification(
    input: CreateNotificationInput,
  ): Promise<SelectNotification> {
    return await this.txHost.tx.notification.create({
      ...SELECT_NOTIFICATION,
      data: {
        title: input.title,
        content: input.content,
        pageType: input.pageType,
      },
    });
  }

  public async selectLoginUserNotificationAllByUserIdx(
    userIdx: number,
    input: GetNotificationAllInput,
  ): Promise<SelectLoginUserNotification[]> {
    return await this.txHost.tx.loginUserNotification.findMany({
      ...SELECT_LOGIN_USER_NOTIFICATION,
      where: { userIdx },
      orderBy: [{ createdAt: 'desc' }, { notificationId: 'desc' }],
      take: input.take,
      skip: input.skip,
    });
  }

  public async selectLoginUserNotificationCountByUserIdx(
    userIdx: number,
  ): Promise<number> {
    return await this.txHost.tx.loginUserNotification.count({
      where: { userIdx },
    });
  }

  public async insertLoginUserNotificationAll(
    notificationId: string,
    userIdxList: number[],
  ): Promise<void> {
    if (userIdxList.length === 0) {
      return;
    }

    await this.txHost.tx.loginUserNotification.createMany({
      data: userIdxList.map((userIdx) => ({
        notificationId,
        userIdx,
      })),
      skipDuplicates: true,
    });
  }

  public async selectNotificationCampaignById(
    id: string,
  ): Promise<SelectNotificationCampaign | null> {
    return await this.txHost.tx.notificationCampaign.findUnique({
      ...SELECT_NOTIFICATION_CAMPAIGN,
      where: { id },
    });
  }

  public async insertNotificationCampaign(
    notificationId: string,
  ): Promise<SelectNotificationCampaign> {
    return await this.txHost.tx.notificationCampaign.create({
      ...SELECT_NOTIFICATION_CAMPAIGN,
      data: {
        notificationId,
        targetCount: 0,
        successCount: 0,
        failCount: 0,
      },
    });
  }

  public async updateNotificationCampaignById(
    id: string,
    input: UpdateNotificationCampaignInput,
  ): Promise<SelectNotificationCampaign> {
    return await this.txHost.tx.notificationCampaign.update({
      ...SELECT_NOTIFICATION_CAMPAIGN,
      where: { id },
      data: {
        targetCount: input.targetCount,
        successCount: input.successCount,
        failCount: input.failCount,
        completedAt: input.completedAt,
      },
    });
  }

  private getNotificationWhere(
    userIdx?: number,
  ): Prisma.NotificationWhereInput {
    return {
      OR: [
        { loginUserNotificationList: { none: {} } },
        ...(userIdx === undefined
          ? []
          : [{ loginUserNotificationList: { some: { userIdx } } }]),
      ],
    };
  }
}
