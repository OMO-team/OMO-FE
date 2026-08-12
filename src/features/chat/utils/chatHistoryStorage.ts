import type { ChatEntry } from '../types/dto';

export type SavedChatSession = {
  sessionId: number;
  title: string;
  updatedAt: number;
  chatHistory: ChatEntry[];
};

const STORAGE_KEY = 'omo:ai-chat-sessions';
const RETENTION_MS = 30 * 24 * 60 * 60 * 1000;
const MAX_SAVED_SESSIONS = 20;

const isFresh = (session: SavedChatSession) => Date.now() - session.updatedAt <= RETENTION_MS;

const readAll = (): SavedChatSession[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isFresh);
  } catch {
    return [];
  }
};

const writeAll = (sessions: SavedChatSession[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch {
    // localStorage 사용 불가(용량 초과, 프라이빗 모드 등) 시 저장을 건너뜀
  }
};

export const loadSessions = (): SavedChatSession[] =>
  readAll().sort((a, b) => b.updatedAt - a.updatedAt);

export const saveSession = (session: SavedChatSession) => {
  const rest = readAll().filter(s => s.sessionId !== session.sessionId);
  const next = [session, ...rest].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, MAX_SAVED_SESSIONS);
  writeAll(next);
};

export const removeSession = (sessionId: number) => {
  writeAll(readAll().filter(s => s.sessionId !== sessionId));
};
