import { API_URL } from '@/app/constant/config';

export type CommonResponse<T> = {
  success: boolean;
  message: string;
  responseObject: T;
  statusCode: number;
  total?: number;
};

export type ListFilesResponse = {
  storage_id?: string | null | number;
  storage_url?: string | null | number;
  thumbnail_id?: string | null | number;
  id: number;
  created_at: string;
  thumbnail?: string;
  thumbnail_url?: string;
  title?: string;
  description?: string;
};

export type ListCompaniesResponse = {
  id: number;
  created_at: string;
  logo_url?: string;
  logo_id?: string;
  name?: string;
  status?: boolean;
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
