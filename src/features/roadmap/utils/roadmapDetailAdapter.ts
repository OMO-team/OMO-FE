import type { DocumentItem, RoadmapTaskItem, TaskCategory } from '../types/api';
import type { RequiredDocumentData, RoadmapTaskData } from '../types/roadmap';
import type { TimeLineTaskCardStatus } from '../components/TimeLineTaskCard';

export const TASK_CATEGORY_LABEL: Record<TaskCategory, string> = {
  VISA: '비자',
  INSURANCE: '보험',
  DOCUMENT: '서류',
  FLIGHT: '항공권',
  ACCOMMODATION: '숙소',
  BANKING: '재정',
};

/** API의 ISO 날짜(YYYY-MM-DD)를 화면 표시용 "YYYY.MM.DD"로 변환 */
export function formatDotDate(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  return value.replaceAll('-', '.');
}

/** 화면 표시용 "YYYY.MM.DD"를 API가 받는 ISO 날짜(YYYY-MM-DD)로 변환 */
export function toIsoDate(value: string): string {
  return value.replaceAll('.', '-');
}

function toTimelineStatus(task: RoadmapTaskItem): TimeLineTaskCardStatus {
  if (task.status === 'COMPLETED') return 'success';
  if (task.isOverdue) return 'missed';
  if (task.status === 'IN_PROGRESS') return 'ongoing';
  if (task.status === 'LOCKED') return 'lock';
  return 'upcoming';
}

/**
 * D-day 표기. 마감이 지나면 scheduleDDay가 음수로 내려와서
 * 그대로 "D-" 뒤에 붙이면 "D--5"처럼 대시가 두 번 찍히므로, 지난 일정은 D+N으로 쓴다.
 */
export function formatDDay(scheduleDDay: number | null | undefined): string | undefined {
  if (scheduleDDay == null) return undefined;
  return scheduleDDay < 0 ? `D+${-scheduleDDay}` : `D-${scheduleDDay}`;
}

/**
 * 로드맵 상세 API의 태스크 목록(RoadmapTaskItem)을 타임라인 카드가 쓰는 형태로 변환.
 * completedDocumentCount는 목록 응답에 없어서 태스크 상세에서 따로 받아 넘겨준다.
 */
export function toRoadmapTaskData(task: RoadmapTaskItem, completedDocumentCount?: number): RoadmapTaskData {
  return {
    status: toTimelineStatus(task),
    dDay: formatDDay(task.scheduleDDay),
    date: formatDotDate(task.dueDate) ?? '일정 미정',
    category: TASK_CATEGORY_LABEL[task.category],
    title: task.name,
    hasDocuments: task.totalDocumentCount > 0,
    stepsCompleted: completedDocumentCount ?? task.completedDocumentCount,
    stepsTotal: task.totalDocumentCount,
  };
}

/** 태스크 상세 API의 서류 목록(DocumentItem)을 서류 카드가 쓰는 형태로 변환 */
export function toRequiredDocumentData(document: DocumentItem): RequiredDocumentData {
  return {
    taskDocumentId: document.taskDocumentId,
    name: document.documentName,
    subtitle: document.description,
    isChecked: document.checked,
    ocrSupport: document.ocrSupport,
  };
}
