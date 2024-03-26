import crypto from 'crypto';
import { appConfiguration } from '../config';
import { isEqual } from 'lodash';

const {
  env,
  encryptAndDecrypt: { algorithm, digestAlgorithm, hexType, iterations, ivKey, ivKeyLength, keyLength, salt, secret, stringType },
} = appConfiguration;

const generateKeyFromString = () => {
  const key = crypto.pbkdf2Sync(secret, salt, iterations, keyLength, digestAlgorithm);

  return key;
};

const key = generateKeyFromString();

const iv = isEqual(env, 'development') ? Buffer.from(ivKey, hexType) : crypto.randomBytes(ivKeyLength);

const encryptedData = (keyToEncrypt: string) => {
  const encodedData = crypto.createCipheriv(algorithm, key, iv);

  let data = encodedData.update(keyToEncrypt, stringType, hexType);

  data += encodedData.final(hexType);

  return data;
};

const decryptedData = (data: string) => {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);

  let decryptedData = decipher.update(data, hexType, stringType);

  decryptedData += decipher.final(stringType);

  return decryptedData;
};

export { decryptedData, encryptedData };
