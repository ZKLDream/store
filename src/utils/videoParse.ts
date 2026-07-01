export const DEFAULT_PARSE_BASE_URL = 'https://ehngysobswsp.sealoshzh.site/';

const URL_PATTERN = /https?:\/\/[^\s]+/i;
const TRAILING_PUNCTUATION = /[)\]}，。；;！!？?、,]+$/;

export interface DirectUrlResolveResponse {
  ok?: boolean;
  input_url?: string;
  resolved_url?: string;
  video_id?: string;
  direct_url?: string;
  direct_urls?: string[];
  final_url?: string;
  final_urls?: string[];
  title?: string;
  source?: string;
  message?: string;
}

export interface ResultLine {
  label: string;
  value: string;
}

export const buildDirectUrlEndpoint = (baseUrl: string): string => {
  const trimmed = (baseUrl || '').trim() || DEFAULT_PARSE_BASE_URL;
  const normalized = trimmed.endsWith('/') ? trimmed : `${trimmed}/`;
  return `${normalized}api/douyin/direct-url`;
};

export const buildDouyinListEndpoint = (baseUrl: string): string => {
  const trimmed = (baseUrl || '').trim() || DEFAULT_PARSE_BASE_URL;
  const normalized = trimmed.endsWith('/') ? trimmed : `${trimmed}/`;
  return `${normalized}api/douyinList`;
};

export interface DouyinListResponse {
  ok?: boolean;
  value?: string;
}

export interface DouyinListConfigItem {
  key: string;
  value: string;
}

export const parseDouyinListValue = (
  response: DouyinListResponse | null | undefined
): DouyinListConfigItem[] => {
  const raw = (response && response.value) || '';
  if (!raw.trim()) {
    return [];
  }

  return raw
    .split(',')
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0)
    .map((segment) => {
      const index = segment.indexOf('=');
      if (index === -1) {
        return { key: segment, value: '' };
      }
      return {
        key: segment.slice(0, index).trim(),
        value: segment.slice(index + 1).trim(),
      };
    })
    .filter((item) => item.key.length > 0);
};

export const isDouyinDebugEnabled = (
  response: DouyinListResponse | null | undefined
): boolean => {
  return parseDouyinListValue(response).some(
    (item) => item.key === 'douyin_debug' && item.value === '1'
  );
};


export const normalizeShareUrl = (raw: string): string | null => {
  const trimmed = (raw || '').trim();
  if (!trimmed) {
    return null;
  }

  const match = trimmed.match(URL_PATTERN);
  if (!match) {
    return null;
  }

  const candidate = match[0]
    .trim()
    .replace(/^["']+/, '')
    .replace(/["']+$/, '')
    .replace(TRAILING_PUNCTUATION, '');

  if (!/^https?:\/\//i.test(candidate)) {
    return null;
  }

  return candidate;
};

const pickList = (single?: string, list?: string[]): string[] => {
  const fallback = (single || '').trim();
  if (fallback) {
    return [fallback];
  }
  return (list || []).map((item) => (item || '').trim()).filter((item) => item.length > 0);
};

export const pickDownloadUrls = (response: DirectUrlResolveResponse | null | undefined): string[] => {
  if (!response) {
    return [];
  }
  const finals = pickList(response.final_url, response.final_urls);
  if (finals.length > 0) {
    return finals;
  }
  return pickList(response.direct_url, response.direct_urls);
};

export const buildResultLines = (
  response: DirectUrlResolveResponse | null | undefined,
  debug = false
): ResultLine[] => {
  if (!response) {
    return [];
  }

  const lines: ResultLine[] = [];
  const push = (label: string, value?: string) => {
    const normalized = (value || '').trim();
    if (normalized) {
      lines.push({ label, value: normalized });
    }
  };

  push('状态', typeof response.ok === 'boolean' ? (response.ok ? '成功' : '失败') : undefined);
  push('标题', response.title);

  if (debug) {
    push('video_id', response.video_id);
    push('来源', response.source);
    push('输入链接', response.input_url);
    push('跳转后链接', response.resolved_url);

    const directUrls = pickList(response.direct_url, response.direct_urls);
    if (directUrls.length > 1) {
      directUrls.forEach((url, index) => push(`直链 ${index + 1}`, url));
    } else if (directUrls.length === 1) {
      push('视频直链', directUrls[0]);
    }
  }

  const finalUrls = pickList(response.final_url, response.final_urls);
  if (finalUrls.length > 1) {
    finalUrls.forEach((url, index) => push(`下载直链 ${index + 1}`, url));
  } else if (finalUrls.length === 1) {
    push('下载直链', finalUrls[0]);
  }

  return lines;
};
