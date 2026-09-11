import { Injectable } from '@nestjs/common';
import { PushTokenCoreRepository } from './push-token-core.repository';
import { Transactional } from '@nestjs-cls/transactional';
import { PushTokenModel } from './model/push-token.model';

@Injectable()
export class PushTokenCoreService {
  constructor(
    private readonly pushTokenCoreRepository: PushTokenCoreRepository,
  ) {}

  /**
   * push token 동기화
   *
   * - 등록된 토큰이 없고 expoPushToken도 없으면 무시
   * - 등록된 토큰이 없고 expoPushToken이 있으면 insert
   * - 등록된 토큰이 있으면 last_seen_at / expo_push_token update
   *
   * installation 등록 시 함께 호출하여 push token을 연동함
   *
   * @publicApi
   */
  @Transactional()
  public async syncPushToken(
    id: string,
    expoPushTokenInput: string | null,
  ): Promise<void> {
    const pushToken =
      await this.pushTokenCoreRepository.selectPushTokenById(id);

    if (!pushToken) {
      if (!expoPushTokenInput) return;

      await this.pushTokenCoreRepository.insertPushToken(
        id,
        expoPushTokenInput,
      );
      return;
    }

    if (!expoPushTokenInput) {
      await this.pushTokenCoreRepository.deletePushToken(id);
      return;
    }

    await this.pushTokenCoreRepository.updatePushToken(id, expoPushTokenInput);
  }

  public async getPushTokenByUserIdx(
    userIdx: number,
  ): Promise<PushTokenModel | null> {
    const pushToken =
      await this.pushTokenCoreRepository.selectPushTokenByUserIdx(userIdx);

    return pushToken && PushTokenModel.fromPrisma(pushToken);
  }

  // /**
  //  * push token 삭제 (hard delete)
  //  * 앱 삭제 감지 등으로 해당 token이 더 이상 유효하지 않을 때 사용
  //  * 토큰이 존재하지 않으면 무시함
  //  *
  //  * @publicApi
  //  */
  // public async deletePushTokenIfExists(id: string): Promise<void> {
  //   const existing = await this.pushTokenCoreRepository.selectPushTokenById(id);

  //   if (!existing) return;

  //   await this.pushTokenCoreRepository.deletePushToken(id);
  // }

  // /**
  //  * push token 조회
  //  *
  //  * @publicApi
  //  */
  // public async getPushTokenById(id: string): Promise<PushTokenModel | null> {
  //   const result = await this.pushTokenCoreRepository.selectPushTokenById(id);

  //   if (!result) return null;

  //   return PushTokenModel.fromPrisma(result);
  // }
}
