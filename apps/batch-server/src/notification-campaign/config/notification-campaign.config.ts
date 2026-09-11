const DEFAULT_PUSH_TOKEN_BATCH_SIZE = 500;

export default () => {
  const pushTokenBatchSize = Number.parseInt(
    process.env.PUSH_TOKEN_BATCH_SIZE || '',
    10,
  );

  return {
    notificationCampaign: {
      pushTokenBatchSize:
        Number.isInteger(pushTokenBatchSize) && pushTokenBatchSize > 0
          ? pushTokenBatchSize
          : DEFAULT_PUSH_TOKEN_BATCH_SIZE,
    },
  };
};
