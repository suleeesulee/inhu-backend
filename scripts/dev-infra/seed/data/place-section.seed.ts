import { PlaceSectionSeedInput } from '@libs/testing/seed/place-section/type/place-section-seed.input';

const placeSection1: PlaceSectionSeedInput = {
  title: '두쫀쿠 맛집',
  parameter: {
    order: 'desc',
    orderby: 'time',
    mainCategoryList: [9],
    freeTagList: ['웨이팅맛집'],
  },
};

const placeSection2: PlaceSectionSeedInput = {
  title: '버터떡 맛집',
  parameter: {
    order: 'desc',
    orderby: 'time',
    mainCategoryList: [10],
    freeTagList: ['재방문의사'],
  },
};

const placeSection3: PlaceSectionSeedInput = {
  title: '라멘 맛집',
  parameter: {
    order: 'desc',
    orderby: 'time',
    mainCategoryList: [2],
    freeTagList: ['인기'],
  },
};

const placeSection4: PlaceSectionSeedInput = {
  title: '중식 맛집',
  parameter: {
    order: 'desc',
    orderby: 'time',
    mainCategoryList: [3],
    freeTagList: ['가성비'],
  },
};

const placeSection5: PlaceSectionSeedInput = {
  title: '분위기 레전드 술집',
  parameter: {
    order: 'desc',
    orderby: 'time',
    mainCategoryList: [18],
    freeTagList: ['분위기좋음'],
  },
};

const placeSection6: PlaceSectionSeedInput = {
  title: '신규 가게',
  parameter: {
    order: 'desc',
    orderby: 'time',
    mainCategoryList: [1],
    freeTagList: ['신규'],
  },
};

const placeSection7: PlaceSectionSeedInput = {
  title: '혼밥 추천 리스트',
  parameter: {
    order: 'desc',
    orderby: 'time',
    mainCategoryList: [4],
    freeTagList: ['혼밥가능'],
  },
};

const placeSection8: PlaceSectionSeedInput = {
  title: '고수들만 가는 곳',
  parameter: {
    order: 'desc',
    orderby: 'time',
    mainCategoryList: [1],
    freeTagList: ['현지인추천'],
  },
};

const placeSection9: PlaceSectionSeedInput = {
  title: '여기서 데이트 안 하면 하수임',
  parameter: {
    order: 'desc',
    orderby: 'time',
    mainCategoryList: [13],
    freeTagList: ['데이트코스'],
  },
};

const placeSection10: PlaceSectionSeedInput = {
  title: '결찰도 포장해서 감',
  parameter: {
    order: 'desc',
    orderby: 'time',
    mainCategoryList: [5],
    freeTagList: ['포장가능'],
  },
};

export const placeSectionSeedDataList = [
  placeSection1,
  placeSection2,
  placeSection3,
  placeSection4,
  placeSection5,
  placeSection6,
  placeSection7,
  placeSection8,
  placeSection9,
  placeSection10,
];
