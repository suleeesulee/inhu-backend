type CountUpdate = number | { increment: number };

export class UpdateNotificationCampaignInput {
  public targetCount?: number;
  public successCount?: CountUpdate;
  public failCount?: CountUpdate;
  public completedAt?: Date | null;
}
