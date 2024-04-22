import { BooleanString } from '@/types/app.js';

export const parseBoolean = (booleanString?: BooleanString) => {
  if (booleanString) {
    if (booleanString === 'true') {
      return true;
    } else if (booleanString === 'false') {
      return false;
    }
  }
  return undefined;
};

export const parseNumber = (value: string | number | undefined) => {
  if (value === undefined) return undefined;
  return parseInt(value as string);
};
