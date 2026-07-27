import {
  createCipheriv,
  createDecipheriv,
  createHmac,
  randomBytes,
} from 'crypto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CryptoService {
  private readonly encryptionKey: Buffer;
  private readonly hmacKey: string;

  constructor(private readonly configService: ConfigService) {
    this.encryptionKey = Buffer.from(
      this.configService.getOrThrow<string>('crypto.encryptionKey'),
      'base64',
    );
    this.hmacKey = this.configService.getOrThrow<string>('crypto.hmacKey');

    if (this.encryptionKey.length !== 32) {
      throw new Error('CRYPTO_ENCRYPTION_KEY must be 32 bytes base64 encoded');
    }
  }

  public encrypt(plainText: string): string {
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', this.encryptionKey, iv);

    const encrypted = Buffer.concat([
      cipher.update(plainText, 'utf8'),
      cipher.final(),
    ]);

    return [
      iv.toString('base64'),
      cipher.getAuthTag().toString('base64'),
      encrypted.toString('base64'),
    ].join(':');
  }

  public decrypt(encryptedText: string): string {
    const [iv, authTag, encrypted] = encryptedText.split(':');

    const decipher = createDecipheriv(
      'aes-256-gcm',
      this.encryptionKey,
      Buffer.from(iv, 'base64'),
    );

    decipher.setAuthTag(Buffer.from(authTag, 'base64'));

    return Buffer.concat([
      decipher.update(Buffer.from(encrypted, 'base64')),
      decipher.final(),
    ]).toString('utf8');
  }

  public hmacDigest(plainText: string): string {
    return createHmac('sha256', this.hmacKey).update(plainText).digest('hex');
  }
}
