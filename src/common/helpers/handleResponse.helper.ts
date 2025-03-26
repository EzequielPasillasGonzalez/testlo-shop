import { Response } from '../Interfaces/Response.Interface';

export const handleResponse = (ok: boolean, data: any, message: string) => {
  let response: Response;

  response = {
    ok,
    message,
    body: data,
  };

  return response;
};
