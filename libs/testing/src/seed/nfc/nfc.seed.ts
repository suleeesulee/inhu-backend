import { faker } from '@faker-js/faker';
import { defaultValue } from '@libs/common/utils/default-value.util';
import { ISeedHelper } from '@libs/testing/interface/seed-helper.interface';
import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';
import { NfcSeedInput } from './type/nfc-seed.input';
import { NfcSeedOutput } from './type/nfc-seed.output';

/**
 * NFC 시드 헬퍼 클래스
 *
 * @publicApi
 */
export class NfcSeedHelper extends ISeedHelper<NfcSeedInput, NfcSeedOutput> {
  public generateFilledInputValue(
    input: NfcSeedInput,
  ): FilledSeedInput<NfcSeedInput> {
    return {
      placeIdx: input.placeIdx,
      score: defaultValue(input.score, 1),
      uid: defaultValue(input.uid, faker.string.uuid()),
      cooldown: defaultValue(input.cooldown, 0),
      activatedAt: defaultValue(input.activatedAt, null),
      deletedAt: defaultValue(input.deletedAt, null),
    };
  }

  public async seed(input: NfcSeedInput): Promise<NfcSeedOutput> {
    const filledInput = this.generateFilledInputValue(input);

    const nfc = await this.prisma.nfc.create({
      select: { idx: true },
      data: {
        placeIdx: filledInput.placeIdx,
        score: filledInput.score,
        uid: filledInput.uid,
        cooldown: filledInput.cooldown,
        activatedAt: filledInput.activatedAt,
        deletedAt: filledInput.deletedAt,
      },
    });

    return { idx: nfc.idx, ...filledInput };
  }
}
