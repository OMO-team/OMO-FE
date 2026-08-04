import { useQuery } from '@tanstack/react-query';
import { compareApi } from '../api/compareApi';

export const useCompareCities = (cityIds: number[]) =>
  useQuery({
    queryKey: ['compareCities', cityIds],
    queryFn: () => compareApi.get(cityIds),
    enabled: cityIds.length >= 2 && cityIds.length <= 3,
  });
