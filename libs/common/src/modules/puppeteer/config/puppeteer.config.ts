export default () => ({
  puppeteer: {
    customExecutablePath: process.env.PUPPETEER_CUSTOM_EXECUTABLE_PATH || '',
    selectorTimeout: Number(process.env.PUPPETEER_SELECTOR_TIMEOUT),
    proxyServer: process.env.PUPPETEER_PROXY_SERVER || '',
  },
});
