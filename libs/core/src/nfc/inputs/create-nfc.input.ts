/**
 * CreateNfcInput 클래스
 *
 * @publicApi
 */
export class CreateNfcInput {
  placeIdx: number;
  score: number;
  uid: string;
  cooldown: number | null;
  activatedAt: Date | null;
}
