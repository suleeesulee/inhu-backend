/**
 * Installation 시드 입력 타입 정의
 *
 * @publicApi
 */
export type InstallationSeedInput = {
  id?: string;
  platform?: 'ios' | 'android';
  appVersion?: string;
  userIdx?: number | null;
  refreshTokenExpiresAt?: Date | null;
};
