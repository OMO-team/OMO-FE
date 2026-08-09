export type PurposeType = 'WORKING_HOLIDAY' | 'EXCHANGE_STUDENT' | 'INTERNSHIP';
export type DifficultyType = 'EASY' | 'NORMAL' | 'HARD';
export type StayDurationType = 'SHORT' | 'MEDIUM' | 'LONG' | 'VERY_LONG';
export type ContinentType =
  'Asia' | 'Europe' | 'North America' | 'South America' | 'Oceania' | 'Africa';

export interface CityQueryParams {
  keyword?: string;
  purposeType?: PurposeType;
  countryCodes?: string[];
  maxMonthlyCost?: number;
  minSafetyScore?: number;
  housingDifficulty?: DifficultyType;
  visaDifficulty?: DifficultyType;
  stayDuration?: StayDurationType;
  continent?: ContinentType;
  page?: number;
  size?: number;
}

export interface CountryItem {
  countryId: number;
  name: string;
  code: string;
  imageUrl: string | null;
  continent: string | null;
  recommendedCityCount: number;
}

export interface CityCountry {
  countryId: number;
  name: string;
}

export interface CityItem {
  cityId: number;
  name: string;
  country: CityCountry;
  continent: string;
  imageUrl: string;
  rating: number;
  description: string;
  monthlyCost: number;
  safetyScore: number;
  housingScore: number;
  visaScore: number;
  languageScore: number;
  internetScore: number;
  stayDuration: StayDurationType;
  isWishlisted: boolean;
}

export interface CitiesResponse {
  data: CityItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}
