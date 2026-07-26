import axios, { type AxiosError } from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

let refreshTokenPromise: Promise<string> | null = null;

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const AUTH_PATHS = ['/auth/v1/login', '/auth/v1/reissue'];
const retriedRequests = new WeakSet<object>();

instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config!;

    if (
      error.response?.status !== 401 ||
      retriedRequests.has(originalRequest) ||
      AUTH_PATHS.some((p) => originalRequest.url?.includes(p))
    ) return Promise.reject(error);

    retriedRequests.add(originalRequest);

    if (!refreshTokenPromise) {
      refreshTokenPromise = (async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post(`${BASE_URL}/auth/v1/reissue`, { refreshToken });
        const newAccessToken: string = data.result.accessToken;
        localStorage.setItem('accessToken', newAccessToken);
        return newAccessToken;
      })().finally(() => {
        refreshTokenPromise = null;
      });
    }

    try {
      const newAccessToken = await refreshTokenPromise;
      originalRequest.headers!.Authorization = `Bearer ${newAccessToken}`;
      return instance(originalRequest);
    } catch {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      return Promise.reject(error);
    }
  },
);
