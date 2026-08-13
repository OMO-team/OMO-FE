import type {
  CityItem,
  CityQueryParams,
  ContinentType,
  DifficultyType,
  PurposeType,
  StayDurationType,
} from '../types/cityInsight';

const PURPOSE_KEYWORDS: Record<string, PurposeType> = {
  워킹홀리데이: 'WORKING_HOLIDAY',
  워홀: 'WORKING_HOLIDAY',
  교환학생: 'EXCHANGE_STUDENT',
  인턴십: 'INTERNSHIP',
  인턴: 'INTERNSHIP',
};

/** "쉽다/어렵다" 계열은 ㅂ·ㄹ 불규칙 활용이라 어간만으로 매칭이 안 돼(쉽다→쉬운/쉬워, 힘들다→힘든)
 *  실제로 쓰일 법한 활용형을 그냥 다 나열한다 */
const DIFFICULTY_KEYWORDS: Record<string, DifficultyType> = {
  쉬운: 'EASY',
  쉬움: 'EASY',
  쉬워: 'EASY',
  쉽고: 'EASY',
  쉽지: 'EASY',
  수월: 'EASY',
  편한: 'EASY',
  편해: 'EASY',
  편하고: 'EASY',
  보통: 'NORMAL',
  무난: 'NORMAL',
  어려운: 'HARD',
  어려움: 'HARD',
  어려워: 'HARD',
  어렵고: 'HARD',
  어렵지: 'HARD',
  까다로운: 'HARD',
  까다로워: 'HARD',
  까다롭고: 'HARD',
  힘든: 'HARD',
  힘들어: 'HARD',
  힘들고: 'HARD',
};
const DIFFICULTY_PATTERN = `(${Object.keys(DIFFICULTY_KEYWORDS).join('|')})`;

const STAY_DURATION_PATTERNS: [RegExp, StayDurationType][] = [
  [/(3개월|세\s*달).{0,4}(이하|이내|미만)|단기/, 'SHORT'],
  [/(6개월|반년).{0,4}(이하|이내|미만)|3.{0,3}6개월/, 'MEDIUM'],
  [/(1년).{0,4}(이하|이내|미만)|6개월.{0,4}1년|반년.{0,4}1년/, 'LONG'],
  [/(1년).{0,4}(이상|초과)|장기|오래/, 'VERY_LONG'],
];

/** 서버 필터(continent 쿼리 파라미터)는 한글 값만 받는다 — 스웨거 문서의 영문 enum(Asia 등)은 조용히 0건 */
const CONTINENT_KEYWORDS: Record<string, ContinentType> = {
  아시아: '아시아',
  유럽: '유럽',
  북아메리카: '북아메리카',
  북미: '북아메리카',
  남아메리카: '남아메리카',
  남미: '남아메리카',
  오세아니아: '오세아니아',
  아프리카: '아프리카',
};

const DEFAULT_GOOD_SAFETY_SCORE = 4;
const DEFAULT_GOOD_LANGUAGE_SCORE = 4;
const DEFAULT_GOOD_INFRA_SCORE = 4;
/** rating은 실제 데이터 상 최고점이 4.3이라(전체 266개 중 4점 이상이 5개뿐) 다른 점수와 같은 기준(4점)을
 *  쓰면 다른 조건과 조합했을 때 거의 항상 0건이 됨 — 실측 분포 기준으로 상위 ~7%대인 3.8을 기본값으로 씀 */
const DEFAULT_GOOD_RATING = 3.8;

export type ParsedSearchQuery = {
  /** /api/v1/cities가 그대로 받는 필터 */
  params: CityQueryParams;
  /** 어학/영어 조건 — 이 엔드포인트엔 필터 파라미터가 없어 응답을 받은 뒤 프론트에서 따로 걸러낸다 */
  minLanguageScore?: number;
  /** 인프라(인터넷 등) 조건 — CityItem.internetScore와 비교, 이 필드도 필터 파라미터가 없어 응답 후에 거른다 */
  minInfraScore?: number;
  /** 평점 조건 — 쿼리 파라미터 자체가 없어(문서에도 없음) CityItem.rating과 응답 후 비교한다 */
  minRating?: number;
};

/** 문장형 검색어에서 /api/v1/cities가 이해하는 구조화된 조건만 뽑아낸다.
 *  이 엔드포인트엔 어학/인프라/평점 같은 필드가 없어 그런 조건은 그냥 버려진다 —
 *  AI가 자연어를 완전히 해석해주진 않지만, 결과 개수가 3개로 고정되지 않는 대신 치른 대가.
 *  continent는 서버 필터가 존재하지만 한글 값만 받는다(영문 enum은 조용히 0건) — CONTINENT_KEYWORDS 참고 */
export function parseSearchQuery(query: string): ParsedSearchQuery {
  const params: CityQueryParams = {};
  let minLanguageScore: number | undefined;
  let minInfraScore: number | undefined;
  let minRating: number | undefined;

  // "200만원 이하"처럼 상한을 명시하는 경우 + "월 생활비 150만원"/"예산 150만원"처럼 생활비·예산
  // 근처에 숫자만 있고 "이하" 같은 꼬리말이 없는 경우 둘 다 예산 상한으로 본다
  const costMatch =
    query.match(/(?<amount>\d+)\s*만\s*원?.{0,4}(이하|이내|미만|예산)/) ??
    query.match(/(생활비|예산).{0,10}?(?<amount>\d+)\s*만\s*원?/);
  if (costMatch?.groups?.amount) params.maxMonthlyCost = Number(costMatch.groups.amount);

  const explicitSafetyMatch = query.match(/치안.{0,10}?(\d)\s*점/);
  if (explicitSafetyMatch) {
    params.minSafetyScore = Number(explicitSafetyMatch[1]);
  } else if (/(치안|안전).{0,6}(좋|우수|높)/.test(query)) {
    params.minSafetyScore = DEFAULT_GOOD_SAFETY_SCORE;
  }

  const explicitLanguageMatch = query.match(/어학.{0,10}?(\d)\s*점/);
  if (explicitLanguageMatch) {
    minLanguageScore = Number(explicitLanguageMatch[1]);
  } else if (/(영어|어학).{0,10}(잘|좋|가능|편|우수|높)/.test(query)) {
    minLanguageScore = DEFAULT_GOOD_LANGUAGE_SCORE;
  }

  const explicitInfraMatch = query.match(/인프라.{0,10}?(\d)\s*점/);
  if (explicitInfraMatch) {
    minInfraScore = Number(explicitInfraMatch[1]);
  } else if (/(인프라|인터넷).{0,6}(좋|우수|높)/.test(query)) {
    minInfraScore = DEFAULT_GOOD_INFRA_SCORE;
  }

  const explicitRatingMatch = query.match(/(평점|별점).{0,10}?(\d)\s*점/);
  if (explicitRatingMatch) {
    minRating = Number(explicitRatingMatch[2]);
  } else if (/(평점|별점).{0,6}(좋|우수|높)/.test(query)) {
    minRating = DEFAULT_GOOD_RATING;
  }

  const housingMatch = query.match(new RegExp(`(숙소|집|주거).{0,10}${DIFFICULTY_PATTERN}`));
  if (housingMatch) params.housingDifficulty = DIFFICULTY_KEYWORDS[housingMatch[2]];

  const visaMatch = query.match(new RegExp(`비자.{0,10}${DIFFICULTY_PATTERN}`));
  if (visaMatch) params.visaDifficulty = DIFFICULTY_KEYWORDS[visaMatch[1]];

  for (const [pattern, value] of STAY_DURATION_PATTERNS) {
    if (pattern.test(query)) {
      params.stayDuration = value;
      break;
    }
  }

  for (const [keyword, purposeType] of Object.entries(PURPOSE_KEYWORDS)) {
    if (query.includes(keyword)) {
      params.purposeType = purposeType;
      break;
    }
  }

  for (const [keyword, continentValue] of Object.entries(CONTINENT_KEYWORDS)) {
    if (query.includes(keyword)) {
      params.continent = continentValue;
      break;
    }
  }

  return { params, minLanguageScore, minInfraScore, minRating };
}

/** 파싱된 결과에 실제로 적용할 조건이 하나라도 있는지 — 검색창이 이 값으로 구조화 검색과
 *  일반 텍스트 검색을 가른다. "아시아"처럼 대륙명 한 단어만 쳐도 여기서 걸려 구조화 검색으로 감 */
export function hasStructuredCondition(parsed: ParsedSearchQuery): boolean {
  return Object.keys(parsed.params).length > 0 || hasClientOnlyCondition(parsed);
}

/** params(서버 필터)에 안 실리는 조건 — /api/v1/cities에 필터 파라미터가 아예 없는 어학·인프라·평점.
 *  하나라도 있으면 전체 결과를 받아와 프론트에서 다시 걸러야 한다 */
export function hasClientOnlyCondition(parsed: ParsedSearchQuery): boolean {
  return (
    parsed.minLanguageScore !== undefined ||
    parsed.minInfraScore !== undefined ||
    parsed.minRating !== undefined
  );
}

/** 서버가 걸러주지 못하는 조건들을 도시 하나하나에 대해 검사 — needsClientRefilter로 전체 결과를
 *  받아온 뒤 이 함수로 AND 교집합을 만든다 */
export function matchesClientOnlyCondition(city: CityItem, parsed: ParsedSearchQuery): boolean {
  if (parsed.minLanguageScore !== undefined && city.languageScore < parsed.minLanguageScore) return false;
  if (parsed.minInfraScore !== undefined && city.internetScore < parsed.minInfraScore) return false;
  if (parsed.minRating !== undefined && city.rating < parsed.minRating) return false;
  return true;
}
