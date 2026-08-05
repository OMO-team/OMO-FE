import type { CompareStatGroup, CompareStatType } from '../types/dto';

/** 지표 표시 순서(생활비 → 치안 → 주거 → 비자 → 인프라) */
export const STAT_ORDER: CompareStatType[] = ['COST', 'SAFETY', 'HOUSING', 'VISA', 'INFRA'];

export const STAT_LABEL: Record<CompareStatType, string> = {
  COST: '생활비',
  SAFETY: '치안',
  HOUSING: '주거',
  VISA: '비자',
  INFRA: '인프라',
};

/** COST는 낮을수록 우수, 나머지는 높을수록 우수 */
const LOWER_IS_BETTER: CompareStatType[] = ['COST'];

export interface CompareStatRow {
  statType: CompareStatType;
  label: string;
  percent: number | null;
  displayValue: string;
  isBest: boolean;
}

/** 비교 API 응답(statType별 그룹)에서 특정 도시의 행 데이터만 뽑아 표시용으로 변환 */
export function getCompareRows(stats: CompareStatGroup[], cityId: number): CompareStatRow[] {
  const byType = new Map(stats.map((group) => [group.statType, group]));

  return STAT_ORDER.filter((type) => byType.has(type)).map((type) => {
    const group = byType.get(type)!;
    const cityValue = group.cityValues.find((v) => v.cityId === cityId)?.value ?? 0;
    const values = group.cityValues.map((v) => v.value);
    const bestValue = LOWER_IS_BETTER.includes(type) ? Math.min(...values) : Math.max(...values);
    const hasMax = group.maxValue != null && group.maxValue > 0;
    const percent = hasMax ? Math.round((cityValue / group.maxValue!) * 100) : null;

    return {
      statType: type,
      label: STAT_LABEL[type],
      percent,
      displayValue: percent !== null ? `${percent}%` : `${cityValue.toLocaleString()}${group.unit}`,
      isBest: cityValue === bestValue,
    };
  });
}
