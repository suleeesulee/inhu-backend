export default () => ({
  naverMenuWorker: {
    baseUrl: process.env.NAVER_MENU_WORKER_BASE_URL || '',
    internalSecret: process.env.NAVER_MENU_WORKER_INTERNAL_SECRET || '',
    requestTimeoutMs:
      Number(process.env.NAVER_MENU_WORKER_REQUEST_TIMEOUT_MS) || 60000,
  },
});
