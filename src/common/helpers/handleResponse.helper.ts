import { Response } from '../Interfaces/Response.Interface';

export const handleResponse = (data: any, message: string) => {
  let response: Response;
  
  response = {
    ok: true,
    body: {
      message,
      data,
    },
  };
  return response;
};
