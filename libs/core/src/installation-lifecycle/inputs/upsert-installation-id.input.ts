export class UpsertInstallationIdInput {
  installationId: string;
  refreshTokenExpiredAt: Date | null;
  appVersion: string;
  platform: 'ios' | 'android';
  userIdx: number | null;
}
