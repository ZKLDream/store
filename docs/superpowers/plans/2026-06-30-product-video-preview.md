# Product Video Preview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为商品增加可选视频资源，在首页商品卡片上显示播放角标，并在点击图片后以弹窗方式播放竖屏短视频，同时支持商品管理页上传和维护视频。

**Architecture:** 保持现有 `image` 作为封面图，新增 `video` 字段保存云存储 `fileID`。首页通过一个独立的视频弹窗组件按需播放，点击图片时先获取临时视频地址再展示。商品管理页扩展上传视频能力，云函数沿用现有商品增改查接口同步读写 `video`。

**Tech Stack:** Taro 4、React 18、TypeScript、微信云开发、Sass、Node `--test` + `ts-node/register`

---

### Task 1: 建立最小测试与媒体辅助逻辑

**Files:**
- Create: `tests/product-media.test.js`
- Create: `src/utils/productMedia.ts`

- [ ] **Step 1: 写失败测试**

```js
const test = require('node:test')
const assert = require('node:assert/strict')

const {
  hasProductVideo,
  getProductVideoFileId,
} = require('../src/utils/productMedia')

test('hasProductVideo returns true only when video is a non-empty string', () => {
  assert.equal(hasProductVideo({ video: 'cloud://video-id' }), true)
  assert.equal(hasProductVideo({ video: '' }), false)
  assert.equal(hasProductVideo({}), false)
})

test('getProductVideoFileId trims valid file ids and filters empty values', () => {
  assert.equal(getProductVideoFileId({ video: '  cloud://video-id  ' }), 'cloud://video-id')
  assert.equal(getProductVideoFileId({ video: '   ' }), '')
  assert.equal(getProductVideoFileId({}), '')
})
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `node --require ts-node/register --test tests/product-media.test.js`
Expected: FAIL with `Cannot find module '../src/utils/productMedia'`

- [ ] **Step 3: 写最小实现**

```ts
type ProductVideoSource = {
  video?: string | null
}

export const getProductVideoFileId = (product: ProductVideoSource): string => {
  if (typeof product.video !== 'string') {
    return ''
  }

  return product.video.trim()
}

export const hasProductVideo = (product: ProductVideoSource): boolean => {
  return getProductVideoFileId(product).length > 0
}
```

- [ ] **Step 4: 再跑测试，确认通过**

Run: `node --require ts-node/register --test tests/product-media.test.js`
Expected: PASS with `2 tests`

### Task 2: 扩展类型、云接口和云函数

**Files:**
- Modify: `src/types/index.ts`
- Modify: `src/utils/cloud.ts`
- Modify: `cloudfunctions/fruitFunctions/index.js`

- [ ] **Step 1: 先补一条接口层失败测试**

Add to `tests/product-media.test.js`:

```js
test('getProductVideoFileId can be used to gate preview behavior', () => {
  const product = { video: 'cloud://env.fruit-videos/video.mp4' }
  assert.equal(getProductVideoFileId(product), 'cloud://env.fruit-videos/video.mp4')
})
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `node --require ts-node/register --test tests/product-media.test.js`
Expected: FAIL if helper naming or exports are inconsistent after next edit

- [ ] **Step 3: 扩展生产代码**

Key changes:

```ts
export interface Fruit {
  _id?: string;
  id: number;
  category: string;
  name: string;
  desc: string;
  price: number;
  costPrice: number;
  image: string;
  video?: string;
}
```

```ts
export const uploadVideo = async (filePath: string): Promise<string> => {
  const extension = filePath.split('.').pop() || 'mp4';
  const cloudPath = `fruit-videos/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${extension}`;
  const res = await Taro.cloud.uploadFile({ cloudPath, filePath });
  return res.fileID;
};

export const getTempFileUrl = async (fileId: string): Promise<string> => {
  const res = await Taro.cloud.getTempFileURL({ fileList: [fileId] });
  const file = res.fileList?.[0];
  if (!file || !file.tempFileURL) {
    throw new Error('获取临时视频地址失败');
  }
  return file.tempFileURL;
};
```

```js
data: {
  id: nextId,
  category: insertRecord.category,
  name: insertRecord.name,
  desc: insertRecord.desc,
  price: Number(insertRecord.price),
  costPrice: Number(insertRecord.costPrice),
  image: insertRecord.image,
  video: insertRecord.video || ''
}
```

- [ ] **Step 4: 跑测试确认仍为绿**

Run: `node --require ts-node/register --test tests/product-media.test.js`
Expected: PASS

### Task 3: 改造商品管理页支持视频上传

**Files:**
- Modify: `src/pages/product-management/index.tsx`
- Modify: `src/pages/product-management/index.module.scss`

- [ ] **Step 1: 先写一条失败测试，锁定视频值为空时的判断**

Add to `tests/product-media.test.js`:

```js
test('hasProductVideo treats cleared video value as absent', () => {
  assert.equal(hasProductVideo({ video: '' }), false)
})
```

- [ ] **Step 2: 跑测试确认失败**

Run: `node --require ts-node/register --test tests/product-media.test.js`
Expected: FAIL if helper behavior regresses during page integration work

- [ ] **Step 3: 实现商品管理页视频上传**

Key changes:

```ts
import { getFruitsData, updateFruit, deleteFruit, uploadImage, insertFruit, uploadVideo } from '@/utils/cloud';
import { hasProductVideo } from '@/utils/productMedia';
```

```ts
const handleVideoUpload = async () => {
  const res = await Taro.chooseMedia({
    count: 1,
    mediaType: ['video'],
    sourceType: ['album', 'camera'],
    maxDuration: 60
  });
  const file = res.tempFiles?.[0];
  if (!file?.tempFilePath) return;
  const fileId = await uploadVideo(file.tempFilePath);
  setEditData(prev => ({ ...prev, video: fileId }));
};

const handleClearVideo = () => {
  setEditData(prev => ({ ...prev, video: '' }));
};
```

And save payloads must include:

```ts
video: editData.video || ''
```

- [ ] **Step 4: 再跑测试确认 helper 逻辑没被带坏**

Run: `node --require ts-node/register --test tests/product-media.test.js`
Expected: PASS

### Task 4: 首页点图弹窗播放视频

**Files:**
- Create: `src/components/VideoPreviewModal/index.tsx`
- Create: `src/components/VideoPreviewModal/index.module.scss`
- Modify: `src/pages/home/index.tsx`
- Modify: `src/pages/home/index.module.scss`
- Modify: `src/components/ProductCard/index.tsx`
- Modify: `src/components/ProductCard/index.module.scss`

- [ ] **Step 1: 先扩一条失败测试，锁定有无视频商品的角标判断**

Add to `tests/product-media.test.js`:

```js
test('hasProductVideo returns false for undefined video so badge can stay hidden', () => {
  assert.equal(hasProductVideo({ video: undefined }), false)
})
```

- [ ] **Step 2: 跑测试确认失败**

Run: `node --require ts-node/register --test tests/product-media.test.js`
Expected: FAIL if helper handling is incomplete

- [ ] **Step 3: 实现首页预览**

Key changes:

```ts
const [previewFruit, setPreviewFruit] = useState<Fruit | null>(null);
const [previewVideoUrl, setPreviewVideoUrl] = useState('');
const [previewLoading, setPreviewLoading] = useState(false);
```

```ts
const handlePreviewVideo = async (fruit: Fruit) => {
  const fileId = getProductVideoFileId(fruit);
  if (!fileId || previewLoading) return;

  try {
    setPreviewLoading(true);
    const tempUrl = await getTempFileUrl(fileId);
    setPreviewFruit(fruit);
    setPreviewVideoUrl(tempUrl);
  } catch (error) {
    Taro.showToast({ title: '视频加载失败', icon: 'none' });
  } finally {
    setPreviewLoading(false);
  }
};
```

```ts
const handleClosePreview = () => {
  setPreviewFruit(null);
  setPreviewVideoUrl('');
};
```

And `ProductCard` must accept:

```ts
onPreviewVideo?: (fruit: Fruit) => void;
```

### Task 5: 验证与构建

**Files:**
- Modify: `package.json` (only if adding a test script is necessary)

- [ ] **Step 1: 跑单元测试**

Run: `node --require ts-node/register --test tests/product-media.test.js`
Expected: PASS

- [ ] **Step 2: 跑 TypeScript / build 验证**

Run: `npm run build:weapp`
Expected: exit 0

- [ ] **Step 3: 检查 diff 是否只包含本需求相关修改**

Run: `git status --short`
Expected: only feature-related files changed
