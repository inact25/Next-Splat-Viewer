import { API_URL } from '@/app/constant/config';

type CommonResponse<T> = {
  success: boolean;
  message: string;
  responseObject: T;
  statusCode: number;
};

type ListFilesResponse = {
  id: number;
  created_at: string;
};

export const listFiles = async (): Promise<
  CommonResponse<ListFilesResponse[]>
> => {
  const response = await fetch(`${API_URL}/file/list`, {
    cache: 'no-cache',
  });
  return await response.json();
};

export const getFile = async (id: string): Promise<CommonResponse<string>> => {
  const response = await fetch(`${API_URL}/file/link/${id}`, {
    cache: 'no-cache',
  });
  return await response.json();
};
