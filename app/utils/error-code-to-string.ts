import { ERROR_DESCRIPTION } from '../constants/transport';

export const errorCodeToString = (statusCode: number) => {
  if (statusCode in ERROR_DESCRIPTION) {
    return ERROR_DESCRIPTION[statusCode];
  }
  return `Unknown Status Code: ${statusCode}`;
};
