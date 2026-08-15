import { createCipheriv } from 'crypto';

const BLOCK_SIZE = 16;
const SUBKEY_RB = 0x87;

export function calculateAesCmac(key: Buffer, message: Buffer): Buffer {
  assertLength(key, BLOCK_SIZE, 'key');

  const zeroBlock = Buffer.alloc(BLOCK_SIZE);
  const firstSubkey = generateSubkey(encryptBlock(key, zeroBlock));
  const secondSubkey = generateSubkey(firstSubkey);
  const blockCount = Math.max(1, Math.ceil(message.length / BLOCK_SIZE));
  const hasCompleteLastBlock =
    message.length > 0 && message.length % BLOCK_SIZE === 0;

  let lastBlock: Buffer;

  if (hasCompleteLastBlock) {
    const start = (blockCount - 1) * BLOCK_SIZE;
    lastBlock = xorBlocks(message.subarray(start), firstSubkey);
  } else {
    const start = (blockCount - 1) * BLOCK_SIZE;
    lastBlock = xorBlocks(padBlock(message.subarray(start)), secondSubkey);
  }

  let state = zeroBlock;

  for (let index = 0; index < blockCount - 1; index += 1) {
    const start = index * BLOCK_SIZE;
    const block = message.subarray(start, start + BLOCK_SIZE);
    state = encryptBlock(key, xorBlocks(state, block));
  }

  return encryptBlock(key, xorBlocks(state, lastBlock));
}

function generateSubkey(block: Buffer): Buffer {
  const shifted = Buffer.alloc(BLOCK_SIZE);
  let carry = 0;

  for (let index = BLOCK_SIZE - 1; index >= 0; index -= 1) {
    shifted[index] = ((block[index] << 1) & 0xff) | carry;
    carry = (block[index] & 0x80) === 0 ? 0 : 1;
  }

  if ((block[0] & 0x80) !== 0) {
    shifted[BLOCK_SIZE - 1] ^= SUBKEY_RB;
  }

  return shifted;
}

function padBlock(block: Buffer): Buffer {
  const padded = Buffer.alloc(BLOCK_SIZE);
  block.copy(padded);
  padded[block.length] = 0x80;
  return padded;
}

function xorBlocks(left: Buffer, right: Buffer): Buffer {
  const result = Buffer.alloc(BLOCK_SIZE);

  for (let index = 0; index < BLOCK_SIZE; index += 1) {
    result[index] = left[index] ^ right[index];
  }

  return result;
}

function encryptBlock(key: Buffer, block: Buffer): Buffer {
  const cipher = createCipheriv('aes-128-ecb', key, null);
  cipher.setAutoPadding(false);
  return Buffer.concat([cipher.update(block), cipher.final()]);
}

function assertLength(value: Buffer, expected: number, name: string): void {
  if (value.length !== expected) {
    throw new RangeError(`${name} must be ${expected} bytes`);
  }
}
