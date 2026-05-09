export default () => ({
  puppeteer: {
    executablePath: process.env.PUPPETEER_CUSTOM_EXECUTABLE_PATH || '',
    selectorTimeout: Number(process.env.PUPPETEER_SELECTOR_TIMEOUT),
  },
});
