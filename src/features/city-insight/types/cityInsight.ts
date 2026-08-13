export type PurposeType = 'WORKING_HOLIDAY' | 'EXCHANGE_STUDENT' | 'INTERNSHIP';
export type DifficultyType = 'EASY' | 'NORMAL' | 'HARD';
export type StayDurationType = 'SHORT' | 'MEDIUM' | 'LONG' | 'VERY_LONG';
/** 스웨거 문서는 영문 enum(Asia/Europe/...)으로 나와있지만 실제로 서버가 받아들이는 값은 한글뿐이다
 *  (영문은 조용히 0건, 확인 안 된 한글 인코딩 이슈로 500처럼 보였을 뿐 실제로는 한글이 정상 동작함) */
export type ContinentType = '아시아' | '유럽' | '북아메리카' | '남아메리카' | '오세아니아' | '아프리카';

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
