import { useQuery } from '@tanstack/react-query';
import { cityResourcesApi, type CityResourcesQuery } from '../api/cityResourcesApi';

export const useCityResources = (cityId: number, query?: CityResourcesQuery) =>
  useQuery({
    queryKey: ['cityResources', cityId, query],
    queryFn: () => cityResourcesApi.get(cityId, query),
  });
