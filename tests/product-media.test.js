const test = require('node:test');
const assert = require('node:assert/strict');

const {
  hasProductVideo,
  getProductVideoFileId,
} = require('../src/utils/productMedia');

test('hasProductVideo returns true only when video is a non-empty string', () => {
  assert.equal(hasProductVideo({ video: 'cloud://video-id' }), true);
  assert.equal(hasProductVideo({ video: '' }), false);
  assert.equal(hasProductVideo({}), false);
});

test('getProductVideoFileId trims valid file ids and filters empty values', () => {
  assert.equal(getProductVideoFileId({ video: '  cloud://video-id  ' }), 'cloud://video-id');
  assert.equal(getProductVideoFileId({ video: '   ' }), '');
  assert.equal(getProductVideoFileId({}), '');
});
