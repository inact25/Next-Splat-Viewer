import { API_URL } from '@/app/constant/config';

export type CommonResponse<T> = {
  success: boolean;
  message: string;
  responseObject: T;
  statusCode: number;
};

export type ListFilesResponse = {
  id: number;
  created_at: string;
  thumbnail?: string;
  title?: string;
  descriptions?: string;
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
