const test = require('node:test');
const assert = require('node:assert/strict');

const {
  DEFAULT_PARSE_BASE_URL,
  buildDirectUrlEndpoint,
  buildDouyinListEndpoint,
  parseDouyinListValue,
  isAiAssistantApproved,
  isDouyinDebugEnabled,
  normalizeShareUrl,
  pickDownloadUrls,
  buildResultLines,
} = require('../src/utils/videoParse.ts');

test('buildDirectUrlEndpoint appends api path and normalizes trailing slash', () => {
  assert.equal(
    buildDirectUrlEndpoint('https://example.com'),
    'https://example.com/api/douyin/direct-url'
  );
  assert.equal(
    buildDirectUrlEndpoint('https://example.com/'),
    'https://example.com/api/douyin/direct-url'
  );
  assert.equal(
    buildDirectUrlEndpoint('  '),
    `${DEFAULT_PARSE_BASE_URL}api/douyin/direct-url`
  );
});

test('buildDouyinListEndpoint appends api/douyinList and normalizes slash', () => {
  assert.equal(
    buildDouyinListEndpoint('https://example.com'),
    'https://example.com/api/douyinList'
  );
  assert.equal(
    buildDouyinListEndpoint('https://example.com/'),
    'https://example.com/api/douyinList'
  );
  assert.equal(buildDouyinListEndpoint(''), `${DEFAULT_PARSE_BASE_URL}api/douyinList`);
});

test('parseDouyinListValue splits comma-separated key=value config', () => {
  assert.deepEqual(
    parseDouyinListValue({ ok: true, value: 'approve_douyin_you=1,douyin_detail=1' }),
    [
      { key: 'approve_douyin_you', value: '1' },
      { key: 'douyin_detail', value: '1' },
    ]
  );
  assert.deepEqual(
    parseDouyinListValue({ value: ' a = b , flag ' }),
    [
      { key: 'a', value: 'b' },
      { key: 'flag', value: '' },
    ]
  );
  assert.deepEqual(parseDouyinListValue({ value: '' }), []);
  assert.deepEqual(parseDouyinListValue(null), []);
});

test('isAiAssistantApproved only true when approve_douyin_you=1 present', () => {
  assert.equal(
    isAiAssistantApproved({ ok: true, value: 'approve_douyin_you=1,douyin_detail=1' }),
    true
  );
  assert.equal(isAiAssistantApproved({ value: 'douyin_detail=1' }), false);
  assert.equal(isAiAssistantApproved({ value: 'approve_douyin_you=0' }), false);
  assert.equal(isAiAssistantApproved({ value: 'approve_douyin_you=1' }), true);
  assert.equal(isAiAssistantApproved({ value: '' }), false);
  assert.equal(isAiAssistantApproved(null), false);
});

test('normalizeShareUrl extracts a clean url from share text', () => {
  assert.equal(
    normalizeShareUrl('7.99 复制打开抖音 https://v.douyin.com/abc123/ 看视频'),
    'https://v.douyin.com/abc123/'
  );
  assert.equal(
    normalizeShareUrl('看看这个 https://v.douyin.com/xyz/。'),
    'https://v.douyin.com/xyz/'
  );
  assert.equal(normalizeShareUrl('没有链接的文案'), null);
  assert.equal(normalizeShareUrl('   '), null);
});

test('pickDownloadUrls prefers final urls then direct urls', () => {
  assert.deepEqual(
    pickDownloadUrls({ final_url: 'https://f', direct_url: 'https://d' }),
    ['https://f']
  );
  assert.deepEqual(
    pickDownloadUrls({ direct_url: 'https://d' }),
    ['https://d']
  );
  assert.deepEqual(
    pickDownloadUrls({ final_urls: ['https://a', 'https://b'] }),
    ['https://a', 'https://b']
  );
  assert.deepEqual(pickDownloadUrls(null), []);
});

test('buildResultLines default shows only status, title, download url', () => {
  const sample = {
    ok: true,
    title: '测试视频',
    video_id: '123',
    source: 'douyin',
    input_url: 'https://in',
    resolved_url: 'https://resolved',
    direct_url: 'https://d',
    final_url: 'https://f',
  };

  assert.deepEqual(buildResultLines(sample), [
    { label: '状态', value: '成功' },
    { label: '标题', value: '测试视频' },
    { label: '下载直链', value: 'https://f' },
  ]);

  assert.deepEqual(buildResultLines(sample, true), [
    { label: '状态', value: '成功' },
    { label: '标题', value: '测试视频' },
    { label: 'video_id', value: '123' },
    { label: '来源', value: 'douyin' },
    { label: '输入链接', value: 'https://in' },
    { label: '跳转后链接', value: 'https://resolved' },
    { label: '视频直链', value: 'https://d' },
    { label: '下载直链', value: 'https://f' },
  ]);

  const multi = buildResultLines({
    final_urls: ['https://video', 'https://audio'],
  });
  assert.deepEqual(multi, [
    { label: '下载直链 1', value: 'https://video' },
    { label: '下载直链 2', value: 'https://audio' },
  ]);

  assert.deepEqual(buildResultLines(null), []);
});

test('isDouyinDebugEnabled only true when douyin_debug=1 present', () => {
  assert.equal(isDouyinDebugEnabled({ value: 'douyin_debug=1' }), true);
  assert.equal(
    isDouyinDebugEnabled({ value: 'approve_douyin_you=1,douyin_debug=1' }),
    true
  );
  assert.equal(isDouyinDebugEnabled({ value: 'douyin_debug=0' }), false);
  assert.equal(isDouyinDebugEnabled({ value: 'approve_douyin_you=1' }), false);
  assert.equal(isDouyinDebugEnabled(null), false);
});
