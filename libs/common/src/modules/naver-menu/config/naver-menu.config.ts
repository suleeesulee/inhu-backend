import { NaverMenuSelectorProfile } from './menu-selector-profile';

const REQUIRED_PROFILE_KEYS = [
  'liSelector',
  'nameSelector',
  'priceSelector',
  'contentSelector',
  'imageSelector',
] as const;

type SelectorProfileInput = Omit<NaverMenuSelectorProfile, 'id'>;

function isCompleteProfile(
  profile: Partial<SelectorProfileInput>,
): profile is SelectorProfileInput {
  return REQUIRED_PROFILE_KEYS.every(
    (key) => typeof profile[key] === 'string' && profile[key].length > 0,
  );
}

export function loadSelectorProfiles(
  prefix: string,
  environment: NodeJS.ProcessEnv = process.env,
): NaverMenuSelectorProfile[] {
  return Object.entries(environment)
    .filter(([key]) => key.startsWith(prefix) && key.length > prefix.length)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => {
      let profile: Partial<SelectorProfileInput>;

      try {
        profile = JSON.parse(value || '{}') as Partial<SelectorProfileInput>;
      } catch {
        throw new Error(`JSON 형식이 잘못된 메뉴 셀렉터 프로필입니다: ${key}`);
      }

      if (!profile || Array.isArray(profile) || !isCompleteProfile(profile)) {
        throw new Error(
          `필수 셀렉터가 누락된 메뉴 셀렉터 프로필입니다: ${key}`,
        );
      }

      return {
        ...profile,
        id: key.slice(prefix.length),
      };
    });
}

function createLegacyProfile(
  profile: Partial<SelectorProfileInput>,
): NaverMenuSelectorProfile[] {
  return isCompleteProfile(profile) ? [{ id: 'legacy', ...profile }] : [];
}

export default () => {
  const pcmapLegacyProfile = createLegacyProfile({
    liSelector: process.env.PCMAP_LI_SELECTOR,
    expandButtonSelector: process.env.PCMAP_EXPAND_BUTTON_SELECTOR,
    nameSelector: process.env.PCMAP_NAME_SELECTOR,
    priceSelector: process.env.PCMAP_PRICE_SELECTOR,
    contentSelector: process.env.PCMAP_CONTENT_SELECTOR,
    imageSelector: process.env.PCMAP_IMAGE_SELECTOR,
  });
  const bookingLegacyProfile = createLegacyProfile({
    rootDivSelector: process.env.BOOKING_ROOT_DIV_SELECTOR,
    liSelector: process.env.BOOKING_LI_SELECTOR,
    nameSelector: process.env.BOOKING_NAME_SELECTOR,
    priceSelector: process.env.BOOKING_PRICE_SELECTOR,
    contentSelector: process.env.BOOKING_CONTENT_SELECTOR,
    imageSelector: process.env.BOOKING_IMAGE_SELECTOR,
    tabBoxSelector: process.env.BOOKING_TAB_BOX_SELECTOR,
    tabItemSelector: process.env.BOOKING_TAB_ITEM_SELECTOR,
    soldOutSelector: process.env.BOOKING_SOLD_OUT_SELECTOR,
  });

  return {
    naverMenu: {
      selectorTimeout: Number(process.env.PUPPETEER_SELECTOR_TIMEOUT),
      pcmap: {
        profiles: [
          ...pcmapLegacyProfile,
          ...loadSelectorProfiles('NAVER_MENU_PCMAP_PROFILE_'),
        ],
        expandButtonSelector: process.env.PCMAP_EXPAND_BUTTON_SELECTOR || '',
        expandTimeout: Number(process.env.PCMAP_EXPAND_TIMEOUT) || 10000,
      },
      booking: {
        profiles: [
          ...bookingLegacyProfile,
          ...loadSelectorProfiles('NAVER_MENU_BOOKING_PROFILE_'),
        ],
        rootDivSelector: process.env.BOOKING_ROOT_DIV_SELECTOR || '',
        tabBoxSelector: process.env.BOOKING_TAB_BOX_SELECTOR || '',
        tabItemSelector: process.env.BOOKING_TAB_ITEM_SELECTOR || '',
        soldOutSelector: process.env.BOOKING_SOLD_OUT_SELECTOR || '',
      },
      menuDivSelector: process.env.NAVER_MENU_DIV_SELECTOR || '',
    },
  };
};
