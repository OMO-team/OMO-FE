import { useQuery } from '@tanstack/react-query';
import { cityCoreSummariesApi } from '../api/cityCoreSummariesApi';

export const useCityCoreSummaries = (cityId: number) =>
  useQuery({
    queryKey: ['cityCoreSummaries', cityId],
    queryFn: () => cityCoreSummariesApi.get(cityId),
  });
