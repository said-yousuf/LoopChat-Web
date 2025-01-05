/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AxiosError,
  AxiosResponse,
  HttpStatusCode,
  InternalAxiosRequestConfig,
} from 'axios';
import { ClientRequest } from 'http';
import { UseFormSetError } from 'react-hook-form';

export interface InputError {
  field: string;
  message: string;
}

export class HttpError {
  public code?: string;
  public message?: string;
  public response?: AxiosResponse;
  public config?: InternalAxiosRequestConfig;
  public request?: XMLHttpRequest | ClientRequest | undefined;

  constructor(private error: AxiosError) {
    this.error = error;

    this.code = error.code;
    this.message = error.message;
    this.response = error.response;
    this.config = error.config;
    this.request = error.request;
  }

  public get getOriginal(): AxiosError {
    return this.error;
  }

  public get isValidation() {
    return this.error.response?.status === HttpStatusCode.UnprocessableEntity;
  }

  public get isWrongCredentials() {
    return this.error.response?.status === HttpStatusCode.UnprocessableEntity;
  }

  public applyValidations(setError: UseFormSetError<any>) {
    if (!this.isValidation) {
      return;
    }

    const errors = (this.error.response?.data as any).errors as InputError[];
    errors.forEach(({ field, message }) => setError(field, { message }));
  }

  public toJSON() {
    return {
      code: this.code,
      message: this.message,
      response: this.response,
      config: this.config,
      request: this.request,
    };
  }
}
