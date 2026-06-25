export default () => ({
  crypto: {
    encryptionKey: process.env.CRYPTO_ENCRYPTION_KEY,
    hmacKey: process.env.CRYPTO_HMAC_KEY,
  },
});
