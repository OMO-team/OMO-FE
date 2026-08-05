import { useQuery } from '@tanstack/react-query';
import { cityStatsApi } from '../api/cityStatsApi';

export const useCityStats = (cityId: number) =>
  useQuery({
    queryKey: ['cityStats', cityId],
    queryFn: () => cityStatsApi.get(cityId),
  });
