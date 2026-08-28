import { defaultValue } from '@libs/common/utils/default-value.util';
import { ISeedHelper } from '@libs/testing/interface/seed-helper.interface';
import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';
import { PlaceVisitSeedInput } from './type/place-visit-seed.input';
import { PlaceVisitSeedOutput } from './type/place-visit-seed.output';
import { faker } from '@faker-js/faker';

/**
 * Place visit 시드 헬퍼 클래스
 *
 * @publicApi
 */
export class PlaceVisitSeedHelper extends ISeedHelper<
  PlaceVisitSeedInput,
  PlaceVisitSeedOutput
> {
  public generateFilledInputValue(
    input: PlaceVisitSeedInput,
  ): FilledSeedInput<PlaceVisitSeedInput> {
    return {
      userIdx: input.userIdx,
      nfcIdx: input.nfcIdx,
      score: defaultValue(input.score, 1),
      latitude: defaultValue(input.latitude, faker.location.latitude()),
      longitude: defaultValue(input.longitude, faker.location.longitude()),
      createdAt: defaultValue(input.createdAt, new Date()),
      deletedAt: defaultValue(input.deletedAt, null),
    };
  }

  public async seed(input: PlaceVisitSeedInput): Promise<PlaceVisitSeedOutput> {
    const filledInput = this.generateFilledInputValue(input);

    const placeVisit = await this.prisma.placeVisit.create({
      select: { id: true },
      data: {
        userIdx: filledInput.userIdx,
        nfcIdx: filledInput.nfcIdx,
        score: filledInput.score,
        latitude: filledInput.latitude,
        longitude: filledInput.longitude,
        createdAt: filledInput.createdAt,
        deletedAt: filledInput.deletedAt,
      },
    });

    return { id: placeVisit.id, ...filledInput };
  }
}
