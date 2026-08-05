export type ChipInfo = {
  id: number;
  title: string;
};

export type BriefingRequest = {
  searchQuery: string;
  isRefine: boolean;
  sessionId: number | null;
};

export type BriefingInitResult = {
  sessionId: number;
  taskId: string;
};

export type CitySummary = {
  cityId: number;
  cityName: string;
  countryName: string;
  imageUrl: string;
  rating: number;
  monthlyCost: number;
  safetyScore: number;
  visaScore: number;
  housingScore: number;
  infraScore: number;
  languageScore: number;
};

export type ResourceDTO = {
  topic: string;
  resourceType: string;
  title: string;
  source: string;
  url: string;
};

export type BriefingData = {
  thinkingTime: number;
  summary: string;
  extractedTags: string[];
  recommendedCities: CitySummary[];
  resources: ResourceDTO[];
};

export type SuggestedRelaxation = {
  type: string;
  message: string;
  query: string;
};

export type BriefingStatusResult = {
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED';
  isRefine: boolean;
  activePurpose: string | null;
  selectedCountry: string | null;
  briefingData: BriefingData | null;
  emptyResultMessage: string | null;
  suggestedRelaxations: SuggestedRelaxation[] | null;
};
