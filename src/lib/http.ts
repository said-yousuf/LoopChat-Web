/* eslint-disable @typescript-eslint/no-explicit-any */

import { useAuthStore } from '@/store/useAuthStore';
import axios, { AxiosError, AxiosRequestConfig, HttpStatusCode } from 'axios';
import { HttpError } from './http-error';

/**
 * Create axios instance
 */
const http = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Axios request interceptor
 */
http.interceptors.request.use(async (request: any) => {
  try {
    if (!request.headers) {
      request.headers = {};
    }

    // Retrieve and set the Authorization token
    const token = useAuthStore.getState().token;
    if (token) {
      (request.headers as any).Authorization = `Bearer ${token}`;
    }

    return request;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.message);
    } else if (error instanceof Error) {
      console.error('Error:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    return Promise.reject(error);
  }
});

/**
 * Add a response interceptor
 */
http.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    /**
     * If admin is not authenticated or
     * the token is expired set token as null
     */
    if (error.response?.status === HttpStatusCode.Unauthorized) {
      useAuthStore.setState({ token: null });
    }

    return Promise.reject(error);
  }
);

/**
 * Create a http get request
 */
export async function getRequest<T = any>(
  endpoint: string,
  params?: object,
  config?: AxiosRequestConfig<any> | undefined
): Promise<T> {
  try {
    const response = await http.get<T>(endpoint, { params, ...config });
    return response.data;
  } catch (error: any) {
    throw new HttpError(error);
  }
}

/**
 * Create a http post request
 */
export async function postRequest<T = any>(
  endpoint: string,
  data?: object,
  config?: AxiosRequestConfig<any> | undefined
): Promise<T> {
  try {
    const response = await http.post<T>(endpoint, data, config);
    return response.data;
  } catch (error: any) {
    throw new HttpError(error);
  }
}

/**
 * Create a http put request
 */
export async function putRequest<T = any>(
  endpoint: string,
  data?: object,
  config?: AxiosRequestConfig<any> | undefined
): Promise<T> {
  try {
    const response = await http.put<T>(endpoint, data, config);
    return response.data;
  } catch (error: any) {
    throw new HttpError(error);
  }
}

/**
 * Create a http patch request
 */
export async function patchRequest<T = any>(
  endpoint: string,
  data?: object,
  config?: AxiosRequestConfig<any> | undefined
): Promise<T> {
  try {
    const response = await http.patch<T>(endpoint, data, config);
    return response.data;
  } catch (error: any) {
    throw new HttpError(error);
  }
}

/**
 * Create a http delete request
 */
export async function deleteRequest<T = any>(
  endpoint: string,
  params?: object,
  config?: AxiosRequestConfig<any> | undefined
): Promise<T> {
  try {
    const response = await http.delete<T>(endpoint, { params, ...config });
    return response.data;
  } catch (error: any) {
    throw new HttpError(error);
  }
}
