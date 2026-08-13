const STORAGE_KEY = 'omo:recent-searches';
const MAX_RECENT_SEARCHES = 10;

const readAll = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : [];
  } catch {
    return [];
  }
};

const writeAll = (queries: string[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queries));
  } catch {
    // localStorage 사용 불가(용량 초과, 프라이빗 모드 등) 시 저장을 건너뜀
  }
};

export const loadRecentSearches = (): string[] => readAll();

/** 이미 있던 검색어면 지우고 맨 앞에 다시 추가 — 재검색하면 최신순으로 올라옴 */
export const addRecentSearch = (query: string): string[] => {
  const trimmed = query.trim();
  if (!trimmed) return readAll();
  const next = [trimmed, ...readAll().filter(q => q !== trimmed)].slice(0, MAX_RECENT_SEARCHES);
  writeAll(next);
  return next;
};

export const removeRecentSearch = (index: number): string[] => {
  const next = readAll().filter((_, i) => i !== index);
  writeAll(next);
  return next;
};

export const clearRecentSearches = (): string[] => {
  writeAll([]);
  return [];
};
