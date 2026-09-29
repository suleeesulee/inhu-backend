import { NfcSeedHelper } from '@libs/testing/seed/nfc/nfc.seed';
import { PlaceSectionSeedHelper } from '@libs/testing/seed/place-section/place-section';
import { PlaceSeedHelper } from '@libs/testing/seed/place/place.seed';
import { AppModule } from '@user/app.module';
import {
  GetPlaceSectionAllV2ResponseDto,
  PlaceSectionItem,
} from '@user/api/place-section/dto/response/get-place-section-all-v2.response.dto';
import { TestHelper } from 'apps/user-server/test/e2e/setup/test.helper';

describe('Place Section E2E test', () => {
  const testHelper = TestHelper.create(AppModule);
  const placeSeedHelper = testHelper.seedHelper(PlaceSeedHelper);
  const placeSectionSeedHelper = testHelper.seedHelper(PlaceSectionSeedHelper);
  const nfcSeedHelper = testHelper.seedHelper(NfcSeedHelper);

  beforeEach(async () => {
    await testHelper.init();
  });

  afterEach(async () => {
    await testHelper.destroy();
  });

  describe('GET /v2/place-section/all', () => {
    it('200 - returns whether each place has nfc', async () => {
      const [placeWithNfc, placeWithoutNfc] = await placeSeedHelper.seedAll([
        { activatedAt: new Date() },
        { activatedAt: new Date() },
      ]);
      await nfcSeedHelper.seed({ placeIdx: placeWithNfc.idx });
      const placeSection = await placeSectionSeedHelper.seed({});

      const response = await testHelper
        .test()
        .get('/v2/place-section/all')
        .query({ page: 1 })
        .expect(200);

      const combinedSectionList: GetPlaceSectionAllV2ResponseDto['combinedSectionList'] =
        response.body.combinedSectionList;
      const section = combinedSectionList.find(
        (item): item is PlaceSectionItem =>
          item.idx === placeSection.idx && item.type === 'PLACE',
      );

      expect(section).toBeDefined();
      expect(section?.placeOverviewList).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ idx: placeWithNfc.idx, hasNfc: true }),
          expect.objectContaining({ idx: placeWithoutNfc.idx, hasNfc: false }),
        ]),
      );
    });
  });
});
