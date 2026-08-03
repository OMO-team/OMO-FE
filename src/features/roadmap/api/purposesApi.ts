import { instance } from '../../../lib/axios';
import { unwrap } from './apiUtils';
import type { ApiResponse, Purpose } from '../types/api';

export const purposesApi = {
  list: async (): Promise<Purpose[]> => {
    const { data } = await instance.get<ApiResponse<Purpose[]>>('/api/v1/purposes');
    return unwrap(data);
  },
};
