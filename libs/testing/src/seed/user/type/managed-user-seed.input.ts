/**
 * Managed 유저 시드 입력 타입 정의
 *
 * @publicApi
 */
export type ManagedUserSeedInput = {
  nickname?: string;
  profileImagePath?: string | null;
  deletedAt?: Date | null;
};
