import { NfcSeedInput } from '@libs/testing/seed/nfc/type/nfc-seed.input';

export const nfcSeedDataList: NfcSeedInput[] = [
  {
    placeIdx: 1,
    score: 1,
    uid: '활성화-NFC-카페-01',
    activatedAt: new Date(),
  },
  {
    placeIdx: 2,
    score: 2,
    uid: '활성화-NFC-식당-02',
    activatedAt: new Date(),
  },
  {
    placeIdx: 3,
    score: 3,
    uid: '비활성화-NFC-술집-03',
    activatedAt: null,
  },
  {
    placeIdx: 4,
    score: 4,
    uid: '삭제된-NFC-카페-04',
    activatedAt: new Date(),
    deletedAt: new Date(),
  },
  {
    placeIdx: 5,
    score: 5,
    uid: '활성화-NFC-식당-05',
    activatedAt: new Date(),
  },
  {
    placeIdx: 6,
    score: 6,
    uid: '비활성화-NFC-카페-06',
    activatedAt: null,
  },
  {
    placeIdx: 7,
    score: 7,
    uid: '활성화-NFC-술집-07',
    activatedAt: new Date(),
  },
  {
    placeIdx: 8,
    score: 8,
    uid: '활성화-NFC-식당-08',
    activatedAt: new Date(),
  },
  {
    placeIdx: 9,
    score: 9,
    uid: '삭제된-NFC-카페-09',
    activatedAt: new Date(),
    deletedAt: new Date(),
  },
  {
    placeIdx: 10,
    score: 10,
    uid: '활성화-NFC-카페-10',
    activatedAt: new Date(),
  },
];
