const test = require('node:test');
const assert = require('node:assert/strict');

const {
  DEFAULT_PARSE_BASE_URL,
  buildDirectUrlEndpoint,
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

test('buildResultLines mirrors single and multi stream display', () => {
  const single = buildResultLines({
    ok: true,
    title: '测试视频',
    video_id: '123',
    source: 'douyin',
    direct_url: 'https://d',
    final_url: 'https://f',
  });
  assert.deepEqual(single, [
    { label: '状态', value: '成功' },
    { label: '标题', value: '测试视频' },
    { label: 'video_id', value: '123' },
    { label: '来源', value: 'douyin' },
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
