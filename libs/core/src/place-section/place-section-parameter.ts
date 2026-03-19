import { MainCategory } from '../category/constants/main-category.constant';

export type PlaceSectionParameter = {
  page: number;
  order: 'asc' | 'desc';
  orderby: 'time' | 'review';
  mainCategoryList?: MainCategory[];
  freeTagList?: string[];
};
