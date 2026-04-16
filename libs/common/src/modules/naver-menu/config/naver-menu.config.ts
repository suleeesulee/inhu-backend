export default () => ({
  naverMenu: {
    executablePath: process.env.PUPPETEER_CUSTOM_EXECUTABLE_PATH || '',
    selectorTimeout: Number(process.env.PUPPETEER_SELECTOR_TIMEOUT),
    pcmap: {
      liSelector: process.env.PCMAP_LI_SELECTOR || '',
      expandButtonSelector: process.env.PCMAP_EXPAND_BUTTON_SELECTOR || '',
      nameSelector: process.env.PCMAP_NAME_SELECTOR || '',
      priceSelector: process.env.PCMAP_PRICE_SELECTOR || '',
      contentSelector: process.env.PCMAP_CONTENT_SELECTOR || '',
      imageSelector: process.env.PCMAP_IMAGE_SELECTOR || '',
    },
    booking: {
      rootDivSelector: process.env.BOOKING_ROOT_DIV_SELECTOR || '',
      liSelector: process.env.BOOKING_LI_SELECTOR || '',
      nameSelector: process.env.BOOKING_NAME_SELECTOR || '',
      priceSelector: process.env.BOOKING_PRICE_SELECTOR || '',
      contentSelector: process.env.BOOKING_CONTENT_SELECTOR || '',
      imageSelector: process.env.BOOKING_IMAGE_SELECTOR || '',
      tabBoxSelector: process.env.BOOKING_TAB_BOX_SELECTOR || '',
      tabItemSelector: process.env.BOOKING_TAB_ITEM_SELECTOR || '',
      soldOutSelector: process.env.BOOKING_SOLD_OUT_SELECTOR || '',
    },
    menuDivSelector: process.env.NAVER_MENU_DIV_SELECTOR || '',
  },
});
