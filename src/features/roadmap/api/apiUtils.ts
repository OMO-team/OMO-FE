import axios from 'axios';
import type { ApiResponse } from '../types/api';

export function unwrap<T>(data: ApiResponse<T>): T {
  if (!data.isSuccess) throw new Error(data.message);
  return data.result;
}

export function isNotFound(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 404;
}

/** 백엔드가 4xx/5xx에도 {isSuccess:false, message}를 담아 보내므로, 그 message를 사용자에게 그대로 보여준다 */
export function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const message = (error.response?.data as { message?: string } | undefined)?.message;
    if (message) return message;
  }
  return fallback;
}
