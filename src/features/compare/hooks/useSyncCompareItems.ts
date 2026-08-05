import { useEffect } from 'react';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { useCompareStore } from '../store/useCompareStore';
import { useCompareItems } from './useCompareItems';

/** 로그인 상태면 서버 비교함(GET /members/me/compare-items)으로 초기 compareList를 채움 */
export function useSyncCompareItems() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const setCompareList = useCompareStore((s) => s.setCompareList);
  const { data } = useCompareItems(isLoggedIn);

  useEffect(() => {
    if (data) setCompareList(data.map((item) => item.cityId));
  }, [data, setCompareList]);
}
