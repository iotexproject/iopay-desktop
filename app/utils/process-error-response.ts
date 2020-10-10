import { Expose } from 'class-transformer';
import { errorCodeToString } from './error-code-to-string';

export class IProcessErrorResponse {
  @Expose()
  public error_message = '';

  @Expose()
  public return_code = '';
}

export const processErrorResponse = (response) => {
  return {
    return_code: response.statusCode,
    error_message: errorCodeToString(response.statusCode),
  } as IProcessErrorResponse;
};
