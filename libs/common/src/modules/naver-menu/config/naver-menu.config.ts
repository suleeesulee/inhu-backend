export default () => ({
  naverMenu: {
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '',
    selectorTimeout: Number(process.env.PUPPETEER_SELECTOR_TIMEOUT),
  },
});
