import { useQuery } from '@tanstack/react-query';
import { compareItemsApi } from '../api/compareItemsApi';

export const useCompareItems = (enabled: boolean) =>
  useQuery({
    queryKey: ['compareItems'],
    queryFn: () => compareItemsApi.list(),
    enabled,
  });
