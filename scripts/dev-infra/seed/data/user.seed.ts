import { UserSeedInput } from '@libs/testing/seed/user/type/user-seed.input';

const rankingUserNicknamePrefixList = [
  '송도',
  '후문',
  '정문',
  '캠퍼스',
  '골목',
  '야간',
  '점심',
  '주말',
  '인천',
  '학산',
];

const rankingUserNicknameSuffixList = [
  '미식가',
  '탐험대',
  '카페지기',
  '메뉴수집가',
  '한끼연구가',
  '디저트사냥꾼',
  '맛집기록가',
  '밥그릇수집가',
];

const rankingUserNicknameList = rankingUserNicknamePrefixList
  .flatMap((prefix) =>
    rankingUserNicknameSuffixList.map((suffix) => `${prefix}${suffix}`),
  )
  .slice(0, 76);

export const userSeedDataList: UserSeedInput[] = [
  { nickname: '맛집탐방가', profileImagePath: '/profile/cat.jpg' },
  { nickname: '인덕이' },
  { nickname: '카페수집가' },
  { nickname: '골목대장' },
  ...rankingUserNicknameList.map((nickname) => ({ nickname })),
];
