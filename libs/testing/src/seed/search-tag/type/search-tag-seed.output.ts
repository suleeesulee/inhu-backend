import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';
import { SearchTagSeedInput } from './search-tag-seed.input';

/**
 * search-tag 시드 출력 타입정의
 *
 * @publicApi
 */
export type SearchTagSeedOutput = FilledSeedInput<SearchTagSeedInput> & {
  idx: number;
};
