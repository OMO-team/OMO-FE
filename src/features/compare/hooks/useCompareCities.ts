import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { compareApi } from '../api/compareApi';
import { useCompareStore } from '../store/useCompareStore';
import { toKoreanCityName, toKoreanCountryName } from '../../../shared/constants/cityCountryMap';

export const useCompareCities = (cityIds: number[]) => {
  const registerCityNames = useCompareStore((s) => s.registerCityNames);
  const query = useQuery({
    queryKey: ['compareCities', cityIds],
    queryFn: async () => {
      const result = await compareApi.get(cityIds);
      // 비교 API는 도시/국가명을 영문으로만 내려줘서 화면에 쓰기 전에 한글로 바꾼다
      return {
        ...result,
        cities: result.cities.map((city) => ({
          ...city,
          cityName: toKoreanCityName(city.cityId, city.cityName),
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
