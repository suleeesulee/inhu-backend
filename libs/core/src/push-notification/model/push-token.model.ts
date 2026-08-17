import { SelectPushToken } from './prisma-type/select-push-token';

export class PushTokenModel {
  public id: string;
  public expoPushToken: string;
  public lastSeenAt: Date;
  public createdAt: Date;

  constructor(data: PushTokenModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(pushToken: SelectPushToken) {
    return new PushTokenModel({
      id: pushToken.id,
      expoPushToken: pushToken.expoPushToken,
      lastSeenAt: pushToken.lastSeenAt,
      createdAt: pushToken.createdAt,
    });
  }
}
