export interface Purpose {
  purposeId: number;
  type: 'WORKING_HOLIDAY' | 'EXCHANGE_STUDENT' | 'INTERNSHIP';
  name: string;
}

export interface Country {
  countryId: number;
  name: string;
  code: string;
  imageUrl: string;
  continent: string
  recommendedCityCount: number
}

export interface CountriesResponse {
  purposeType: string;
  countries: Country[];
}
