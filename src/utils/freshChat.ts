import Taro from '@tarojs/taro';

export const FRESH_CHAT_BASE_URL = 'https://xdlaqzoxfpba.sealoshzh.site';
export const FRESH_CHAT_CHAT_URL = `${FRESH_CHAT_BASE_URL}/chat`;

const CLIENT_ID_KEY = 'fresh-chat-claude-client-id';
const SESSION_ID_PREFIX = 'fresh-chat-claude-session-id:';

export interface FreshChatHistoryMessage {
  role: string;
  content?: string;
  timestamp?: number | string;
}

export interface FreshChatHistoryResponse {
  ok?: boolean;
  messages?: FreshChatHistoryMessage[];
}

export interface FreshChatSendResponse {
  session_id?: string;
  stdout?: string;
  error?: string;
  stderr?: string;
}

function createScopedId(): string {
  return `claude-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function getClientId(): string {
  const saved = Taro.getStorageSync(CLIENT_ID_KEY);
  if (saved) {
    return saved as string;
  }
  const nextId = createScopedId();
  Taro.setStorageSync(CLIENT_ID_KEY, nextId);
  return nextId;
}

function getSessionStorageKey(clientId: string): string {
  return `${SESSION_ID_PREFIX}${clientId}`;
}

export function getStoredSessionId(clientId: string): string {
  return (Taro.getStorageSync(getSessionStorageKey(clientId)) as string) || '';
}

export function persistSessionId(clientId: string, sessionId: string): void {
  if (!sessionId) {
    return;
  }
  Taro.setStorageSync(getSessionStorageKey(clientId), sessionId);
}

export function clearStoredSessionId(clientId: string): void {
  Taro.removeStorageSync(getSessionStorageKey(clientId));
}

export function formatChatTime(input?: number | string | Date): string {
  const date =
    input === undefined || input === null || input === ''
      ? new Date()
      : new Date(input);
  const valid = Number.isNaN(date.getTime()) ? new Date() : date;
  const hh = String(valid.getHours()).padStart(2, '0');
  const mm = String(valid.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

export async function fetchChatHistory(
  sessionId: string
): Promise<FreshChatHistoryMessage[]> {
  const res = await Taro.request({
    url: `${FRESH_CHAT_BASE_URL}/sessions/${encodeURIComponent(sessionId)}/history`,
    method: 'GET',
    timeout: 30000,
  });
  if (res.statusCode < 200 || res.statusCode >= 300) {
    return [];
  }
  const data = res.data as FreshChatHistoryResponse;
  if (!data?.ok || !Array.isArray(data.messages)) {
    return [];
  }
  return data.messages;
}

export async function sendChatMessage(
  message: string,
  sessionId: string
): Promise<FreshChatSendResponse> {
  const res = await Taro.request({
    url: FRESH_CHAT_CHAT_URL,
    method: 'POST',
    timeout: 120000,
    header: { 'content-type': 'application/json' },
    data: { message, session_id: sessionId },
  });
  const data = (res.data || {}) as FreshChatSendResponse;
  if (res.statusCode < 200 || res.statusCode >= 300) {
    throw new Error(data.error || data.stderr || `接口调用失败 HTTP ${res.statusCode}`);
  }
  return data;
}
