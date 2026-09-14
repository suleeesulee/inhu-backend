export default () => ({
  nfc: {
    masterKey: process.env.NFC_MASTER_KEY,
    defaultCooldownSeconds: Number(process.env.NFC_DEFAULT_COOLDOWN_SECONDS),
  },
});
