import type { KeyMetricItem } from '../../../shared/types/cityReport';
import type { CityStatItem, CityStatType } from '../types/dto';

const STAT_LABEL: Record<CityStatType, string> = {
  COST: '생활비',
  INTERNET: '인터넷',
  SAFETY: '치안',
  HOUSING: '주거',
  VISA: '비자',
  INFRA: '인프라',
};

/** 지표 표시 순서(생활비 → 인터넷 → 치안 → 주거 → 비자 → 인프라) */
const STAT_ORDER: CityStatType[] = ['COST', 'INTERNET', 'SAFETY', 'HOUSING', 'VISA', 'INFRA'];

/** 생활비는 API가 maxValue를 안 줘서(상한이 없는 값), 월 500만원을 100% 기준선으로 잡아 퍼센트로 환산 */
const COST_REFERENCE_MAX = 500;

/** 도시 스탯 API(GET /api/v1/cities/{cityId}/stats)를 KeyMetrics가 쓰는 형태로 변환 */
export function toKeyMetrics(stats: CityStatItem[]): KeyMetricItem[] {
  const byType = new Map(stats.map((stat) => [stat.statType, stat]));

  return STAT_ORDER.filter((type) => byType.has(type)).map((type, index) => {
    const stat = byType.get(type)!;
    const hasMax = stat.maxValue != null && stat.maxValue > 0;
    const percentage = hasMax
      ? Math.round((stat.value / stat.maxValue!) * 100)
      : type === 'COST'
        ? Math.min(100, Math.round((stat.value / COST_REFERENCE_MAX) * 100))
        : null;

    return {
      id: type,
      label: STAT_LABEL[type],
      percentage,
      barColor: index % 2 === 0 ? 'gray' : 'gradient',
      displayValue: percentage !== null ? `${percentage}%` : `${stat.value.toLocaleString()}${stat.unit}`,
    };
  });
}
