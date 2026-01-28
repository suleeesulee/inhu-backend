export default () => ({
  roulette: {
    TARGET_PLACE_IDX_LIST: process.env.TARGET_PLACE_IDX_LIST
      ? process.env.TARGET_PLACE_IDX_LIST.split(',').map((id) =>
          Number(id.trim()),
        )
      : [],
    MULTIPLIER: parseFloat(process.env.MULTIPLIER || '1.3'),
  },
});
