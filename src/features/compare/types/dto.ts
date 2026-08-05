export type CompareStatType = 'SAFETY' | 'COST' | 'HOUSING' | 'VISA' | 'INFRA';

export interface CompareCityHeader {
  cityId: number;
  cityName: string;
  countryName: string;
  imageUrl: string;
  rating: number;
}

export interface CompareCityValue {
  cityId: number;
  value: number;
}

export interface CompareStatGroup {
  statType: CompareStatType;
  maxValue: number | null;
  unit: string;
  cityValues: CompareCityValue[];
}

export interface CompareResult {
  cities: CompareCityHeader[];
  stats: CompareStatGroup[];
}

/** CompareSelectionBar 등에서 칩 라벨 표시용으로만 필요한 최소 정보 */
export interface CompareSelectableCity {
  cityId: number;
  cityName: string;
}

export interface CompareItem {
  cityId: number;
  createdAt: string;
}
