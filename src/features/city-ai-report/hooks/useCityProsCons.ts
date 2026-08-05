import { useQuery } from '@tanstack/react-query';
import { cityProsConsApi } from '../api/cityProsConsApi';

export const useCityProsCons = (cityId: number) =>
  useQuery({
    queryKey: ['cityProsCons', cityId],
    queryFn: () => cityProsConsApi.get(cityId),
  });
