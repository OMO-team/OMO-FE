import axios from 'axios';
import type { ApiResponse } from '../types/api';

export function unwrap<T>(data: ApiResponse<T>): T {
  if (!data.isSuccess) throw new Error(data.message);
  return data.result;
}

export function isNotFound(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 404;
}
