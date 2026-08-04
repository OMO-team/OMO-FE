import { useQuery } from '@tanstack/react-query';
import { termsApi } from '../api/termsApi';

export const useTerms = () =>
  useQuery({
    queryKey: ['terms'],
    queryFn: termsApi.get,
  });
