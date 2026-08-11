import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { compareApi } from '../api/compareApi';
import { useCompareStore } from '../store/useCompareStore';

export const useCompareCities = (cityIds: number[]) => {
  const registerCityNames = useCompareStore((s) => s.registerCityNames);
  const query = useQuery({
    queryKey: ['compareCities', cityIds],
    queryFn: () => compareApi.get(cityIds),
    enabled: cityIds.length >= 2 && cityIds.length <= 3,
  });

  useEffect(() => {
    if (query.data) registerCityNames(query.data.cities);
  }, [query.data, registerCityNames]);

  return query;
};
