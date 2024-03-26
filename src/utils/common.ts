import { ExpirationTypes } from './interfaces';

const expirationTypes: ExpirationTypes = {
  d: 'days',
  h: 'hours',
  m: 'minutes',
};

const getExpireType = (expireType: string) => {
  return expirationTypes[expireType as keyof ExpirationTypes];
};

export { getExpireType };
