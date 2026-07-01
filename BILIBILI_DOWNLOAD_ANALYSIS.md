# B 站视频下载 / 保存问题分析

> 记录 B 站（bilibili）视频在小程序去水印保存链路中的问题定位与方案取舍。
> 涉及文件：云函数 `cloudfunctions/fruitFunctions/index.js`、小程序 `src/pages/video-dewatermark/index.tsx`、`src/utils/videoParse.ts`、Android 端 `douyin-android-app/.../DashVideoMerger.kt`。

## 一、背景：两条下载链路

| 链路 | 位置 | 是否处理 DASH 双流 | Referer 处理 |
|------|------|------|------|
| Android 端 | `DashVideoMerger.kt` | ✅ 视频流+音频流 MediaMuxer 本地合成 | ✅ 按 host 注入 `bilibili.com` Referer |
| 小程序 + 云函数 | `fruitFunctions` `downloadVideoToCloud` | ❌ 只下单条 URL | ✅ 已修（见下） |

小程序保存链路（`handleSaveToAlbum`）四步：

```
downloadVideoToCloud(url)   → 云函数抓字节 + 上云存储
getTempFileUrl(fileID)      → 换临时 URL
downloadCloudVideo(tempUrl) → 下到本地临时文件
saveVideoToPhotosAlbum()    → 存入系统相册（真正卡住的一步）
```

## 二、已完成改动：云函数 Referer 按 host 判断

**问题**：原代码 `Referer: target.origin`，B 站 CDN 会算出 `https://xxx.bilivideo.com`，而 B 站防盗链要求 Referer 必须是 `https://www.bilibili.com/` → 403 / connection reset。

**修复**（`cloudfunctions/fruitFunctions/index.js`）：新增 `isBilibiliCdn()` + `resolveReferer()`，对 B 站 CDN（`bilivideo.com` / `bilibili.com` / `akamaized.net` / `hdslb.com`）固定使用 `https://www.bilibili.com/`，其它站点沿用 `target.origin`。逻辑与 Android 端 `DownloadRequestHeaders` 白名单一致。重定向递归时会对新 target 重新计算 Referer。

> ⚠️ 需重新部署 `fruitFunctions` 云函数才生效。

## 三、核心问题：`.m4s` 流下载成功却无法保存到相册

"服务端下载成功" ≠ "能存进相册"。前三步只是搬运字节（云函数拿到 HTTP 200 就算成功，不校验内容），真正失败在最后一步 `Taro.saveVideoToPhotosAlbum`。

以样例直链 `...39078201219-1-30032.m4s?...deadline=...` 为例，三重障碍任一都会导致失败：

1. **`.m4s` 是 DASH 分片（fragmented MP4），不是标准完整 mp4 容器**。微信 `saveVideoToPhotosAlbum` 只认 `mp4/mov` 完整可播放容器；且云函数 `getExtFromUrl` 会把扩展名原样存成 `.m4s`，系统按扩展名就不当它是视频。
2. **纯视频轨、无音频**（`30032` = 480P AVC 视频流 code），音频是另一条 `.m4s`。即使改名 `.mp4` 也是残缺文件。
3. **只是整段视频的一半**。B 站 DASH 把音、视频拆成两条独立 `.m4s`。

**结论：`.m4s` 流无法直接保存，是文件本身的问题，不是下载的问题。** 必须先变成"标准的、含音轨的完整 mp4"。

## 四、"复制直链到浏览器"兜底对 B 站走不通

现有失败兜底（`video-dewatermark/index.tsx`）是"复制 previewUrl 到浏览器下载"，**只对抖音/小红书成立**（单文件 progressive、Referer 宽松）。对 B 站必死：

1. **Referer 防盗链（最致命）**：浏览器地址栏请求不会带 `Referer: bilibili.com` → 403，浏览器永远无解。
2. **`.m4s` 纯视频流无声音**。
3. **`deadline` 签名直链会过期**。

因此对 B 站，**唯一可行下载路径是走云函数**（已带正确 Referer 绕过 403），浏览器兜底是死路。

## 五、完整方案（三件事叠加）

| 问题 | 解法 | 位置 | 状态 |
|------|------|------|------|
| 无声音（DASH 双流） | 方案 A：解析端返回单流 progressive（含音轨） | Python 解析服务（不在本仓库） | 待办 |
| 403 防盗链 | 下载走云函数带 `bilibili.com` Referer | 云函数（本仓库） | ✅ 已完成 |
| 浏览器兜底走不通 | B 站隐藏/替换"复制到浏览器"提示，只走云函数转存 | 小程序端（本仓库） | 待办 |

### 方案 A（选定方向）：解析端优先取单流 progressive

在 Python 解析服务的 yt-dlp 调用里，对 B 站换成"优先单流"format：

```python
# B 站优先选 progressive 单流（durl，含音轨），拿不到才回退 DASH
if is_bilibili(url):
    ydl_opts["format"] = (
        "best[acodec!=none][vcodec!=none]"   # 单文件且音视频都在
        "/best[ext=mp4][acodec!=none]"
        "/best"                               # 兜底
    )
```

要点：
- `best[acodec!=none][vcodec!=none]` 强制选**同时含音视频**的单一 format，绕开 DASH 拆流，`final_urls` 只有一条。
- B 站未登录时低清晰度（360P/480P）通常有 `durl` progressive 流；**高清 1080P+ 基本只有 DASH** → 方案 A 代价是清晰度上限降低（已接受的取舍）。
- 若某视频**只有** DASH（选择器全落空回退 `best`），仍会吐两条流，需服务端做保护（返回 durl 低清版，或标记 `needs_merge=true` 让端上提示）。

**小程序端零改动**：`pickDownloadUrls` 取 `final_urls[0]`，服务端返回单条含音轨的流后自然就是完整视频。

### 其它合成方案对比（备忘）

| 方案 | 位置 | 资源开销 | 可行性 |
|------|------|------|------|
| A. 解析取单流 progressive | Python 服务 | 极低 | 中（高清多为 DASH） |
| B. Python `ffmpeg -c copy` remux | Python 服务 | 低（remux 不重编码，吃磁盘IO） | 高（配合 PVC 规避 Sealos 磁盘限制） |
| C. 云函数纯 JS remux | 云函数 | 高（300MB 全进内存易 OOM） | 低（不推荐） |
| D. 云函数集成 ffmpeg 二进制 | 云函数 | 中高（冷启动慢、包体大） | 中 |
| E. Android MediaMuxer | 客户端 | 低 | 已完成，仅限 App |

## 六、可选的端上止损（本仓库可做）

在方案 A 落地前，可先做错误提示优化，避免"静默存成无声视频"或"误导复制到浏览器"：

- 识别 B 站直链（`bilivideo.com`）时，失败提示不再引导"复制到浏览器"，明确告知走 App 内转存。
- 解析结果为双流（`final_urls.length > 1`）时，直接提示"该视频音视频分离，暂不支持保存"，不走 `saveVideoToPhotosAlbum`。
- 或在云函数侧检测到 `.m4s`（DASH 分片）时直接返回明确错误，而非让链路走到最后报含糊的"保存失败"。
