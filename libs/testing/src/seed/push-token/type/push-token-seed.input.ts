/**
 * PushToken 시드 입력 타입 정의
 *
 * installation_tb의 id를 참조하는 FK이므로 id는 필수입니다.
 *
 * @publicApi
 */
export type PushTokenSeedInput = {
  id: string;
  expoPushToken?: string;
};
