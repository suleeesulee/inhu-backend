import { createDecipheriv, timingSafeEqual } from 'crypto';
import { calculateAesCmac } from '../../../common/src/modules/crypto/aes-cmac';

const AES_KEY_LENGTH = 16;
const ENCRYPTED_PICC_DATA_LENGTH = 16;
const UID_LENGTH = 7;
const READ_COUNTER_LENGTH = 3;
const NFC_MAC_LENGTH = 8;
const PICC_DATA_TAG = 0xc7;
const SESSION_MAC_VECTOR_PREFIX = Buffer.from('3CC300010080', 'hex');

export type DecryptedNfcPiccData = {
  piccDataTag: number;
  uid: Buffer;
  readCounter: Buffer;
};

export function deriveNfcAesKey(
  masterKey: Buffer,
  diversificationInput: Buffer,
): Buffer {
  assertLength(masterKey, AES_KEY_LENGTH, 'masterKey');

  if (diversificationInput.length === 0 || diversificationInput.length > 31) {
    throw new RangeError('diversificationInput must be between 1 and 31 bytes');
  }

  return calculateAesCmac(
    masterKey,
    Buffer.concat([Buffer.from([0x01]), diversificationInput]),
  );
}

export function decryptNfcPiccData(
  encryptedPiccData: Buffer,
  nfcAesKey: Buffer,
): DecryptedNfcPiccData {
  assertLength(
    encryptedPiccData,
    ENCRYPTED_PICC_DATA_LENGTH,
    'encryptedPiccData',
  );
  assertLength(nfcAesKey, AES_KEY_LENGTH, 'nfcAesKey');

  const decipher = createDecipheriv(
    'aes-128-cbc',
    nfcAesKey,
    Buffer.alloc(AES_KEY_LENGTH),
  );
  decipher.setAutoPadding(false);

  const decrypted = Buffer.concat([
    decipher.update(encryptedPiccData),
    decipher.final(),
  ]);

  if (decrypted[0] !== PICC_DATA_TAG) {
    throw new Error('Invalid PICC data tag');
  }

  return {
    piccDataTag: decrypted[0],
    uid: Buffer.from(decrypted.subarray(1, 1 + UID_LENGTH)),
    readCounter: Buffer.from(
      decrypted.subarray(1 + UID_LENGTH, 1 + UID_LENGTH + READ_COUNTER_LENGTH),
    ),
  };
}

export function deriveNfcSessionMacKey(
  nfcAesKey: Buffer,
  uid: Buffer,
  readCounter: Buffer,
): Buffer {
  assertLength(nfcAesKey, AES_KEY_LENGTH, 'nfcAesKey');
  assertLength(uid, UID_LENGTH, 'uid');
  assertLength(readCounter, READ_COUNTER_LENGTH, 'readCounter');

  return calculateAesCmac(
    nfcAesKey,
    Buffer.concat([SESSION_MAC_VECTOR_PREFIX, uid, readCounter]),
  );
}

export function calculateNfcMac(
  sessionMacKey: Buffer,
  macInput: Buffer = Buffer.alloc(0),
): Buffer {
  assertLength(sessionMacKey, AES_KEY_LENGTH, 'sessionMacKey');

  const fullMac = calculateAesCmac(sessionMacKey, macInput);
  const truncatedMac = Buffer.alloc(NFC_MAC_LENGTH);

  for (let index = 0; index < NFC_MAC_LENGTH; index += 1) {
    truncatedMac[index] = fullMac[index * 2 + 1];
  }

  return truncatedMac;
}

export function verifyNfcMac(
  sessionMacKey: Buffer,
  receivedMac: Buffer,
  macInput: Buffer = Buffer.alloc(0),
): boolean {
  assertLength(receivedMac, NFC_MAC_LENGTH, 'receivedMac');
  return timingSafeEqual(calculateNfcMac(sessionMacKey, macInput), receivedMac);
}

function assertLength(value: Buffer, expected: number, name: string): void {
  if (value.length !== expected) {
    throw new RangeError(`${name} must be ${expected} bytes`);
  }
}
