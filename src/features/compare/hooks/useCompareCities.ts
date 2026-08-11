import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { compareApi } from '../api/compareApi';
import { useCompareStore } from '../store/useCompareStore';
import { toKoreanCountryName } from '../../../shared/constants/cityCountryMap';

export const useCompareCities = (cityIds: number[]) => {
  const registerCityNames = useCompareStore((s) => s.registerCityNames);
  const query = useQuery({
    queryKey: ['compareCities', cityIds],
    queryFn: async () => {
      const result = await compareApi.get(cityIds);
      // 도시명은 서버가 한글로 주지만 국가명은 아직 영문이라 여기서 바꾼다
      return {
        ...result,
        cities: result.cities.map((city) => ({
          ...city,
          countryName: toKoreanCountryName(city.cityId, city.countryName),
        })),
      };
    },
    enabled: cityIds.length >= 2 && cityIds.length <= 3,
  });

  useEffect(() => {
    if (query.data) registerCityNames(query.data.cities);
  }, [query.data, registerCityNames]);

  return query;
};
