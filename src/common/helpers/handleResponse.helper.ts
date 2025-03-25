import { Response } from '../Interfaces/Response.Interface';

export const handleResponse = (data: any, message: string) => {
  let response: Response;

  response = {
    ok: true,
    message,
    body: data,
  };
  
  return response;
};
