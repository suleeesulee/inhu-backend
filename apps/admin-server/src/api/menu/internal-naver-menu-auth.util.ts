import { createHmac, randomUUID, timingSafeEqual } from 'crypto';

export const NAVER_MENU_INTERNAL_AUTH_HEADERS = {
  timestamp: 'x-naver-menu-timestamp', // 요청 보낸 시간
  nonce: 'x-naver-menu-nonce', // 매 요청마다 새로운 random uuid
  signature: 'x-naver-menu-signature', // timestamp + nonce + naverPlaceId를 secret으로 HMAC-SHA256한 값
} as const;

export type NaverMenuInternalSignaturePayload = {
  timestamp: string;
  nonce: string;
  naverPlaceId?: string;
};

export function createNaverMenuInternalHeaders(
  secret: string,
  naverPlaceId?: string,
): Record<string, string> {
  const timestamp = Date.now().toString();
  const nonce = randomUUID();

  return {
    [NAVER_MENU_INTERNAL_AUTH_HEADERS.timestamp]: timestamp,
    [NAVER_MENU_INTERNAL_AUTH_HEADERS.nonce]: nonce,
    [NAVER_MENU_INTERNAL_AUTH_HEADERS.signature]:
      createNaverMenuInternalSignature(secret, {
        timestamp,
        nonce,
        naverPlaceId,
      }),
  };
}

// HMAC-SHA256를 사용하여 signature를 검증하는 함수
export function verifyNaverMenuInternalSignature(
  secret: string,
  payload: NaverMenuInternalSignaturePayload,
  signature: string,
): boolean {
  const expected = createNaverMenuInternalSignature(secret, payload);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (actualBuffer.length !== expectedBuffer.length) {
    return false;
  }

  // timingSafeEqual을 사용하여 안전하게 비교 (문자열 비교 시 timing attack 방지)
  return timingSafeEqual(actualBuffer, expectedBuffer);
}

// HMAC-SHA256를 사용하여 signature를 생성하는 함수
function createNaverMenuInternalSignature(
  secret: string,
  payload: NaverMenuInternalSignaturePayload,
): string {
  return createHmac('sha256', secret)
    .update(
      [payload.timestamp, payload.nonce, payload.naverPlaceId ?? ''].join('.'),
    )
    .digest('hex');
}
