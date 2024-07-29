'use client';
import axios from 'axios';
import { CommonResponse, ListFilesResponse } from '@/app/actions/http';

const httpClient = (baseUrl: string, token?: string) => {
  const axiosClient = axios.create({
    baseURL: baseUrl,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${(token ?? typeof localStorage !== 'undefined') ? localStorage.getItem('token') : ''}`,
    },
  });
  axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response.status === 401) {
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem('token');
        }
        window.location.href = '/admin';
      }
      return Promise.reject(error);
    },
  );
  //auth/login

  const login = async (data: {
    email: string;
    password: string;
  }): Promise<
    CommonResponse<{
      token: string;
      expired_at: string;
    }>
  > => {
    return axiosClient
      .post('/auth/login', data)
      .then((response) => response.data);
  };
  const editFile = async (
    id: number,
    file: any | null,
    thumbnail: any | null,
    title: string,
    descriptions: string,
  ): Promise<CommonResponse<ListFilesResponse>> => {
    const formData = new FormData();
    if (file) formData.append('file', file);
    if (thumbnail) formData.append('thumbnail', thumbnail);
    formData.append('title', title);
    formData.append('descriptions', descriptions);
    return axiosClient
      .put(`/file/upload/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => response.data);
  };
  const removeFile = async (id: number): Promise<CommonResponse<string>> => {
    return axiosClient
      .delete(`/file/upload/${id}`)
      .then((response) => response.data);
  };
  const uploadFile = async (
    file: any,
    thumbnail: any,
    title: string,
    descriptions: string,
  ): Promise<CommonResponse<ListFilesResponse>> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('thumbnail', thumbnail);
    formData.append('title', title);
    formData.append('descriptions', descriptions);
    return axiosClient
      .post('/file/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => response.data);
  };
  const listFiles = async (): Promise<CommonResponse<ListFilesResponse[]>> => {
    return axiosClient.get('/file/list').then((response) => response.data);
  };
  return {
    uploadFile,
    listFiles,
    login,
    removeFile,
    editFile,
  };
};

export default httpClient;
