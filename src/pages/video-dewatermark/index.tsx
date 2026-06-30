import React, { useState } from 'react';
import { View, Text, Textarea, Video } from '@tarojs/components';
import Taro from '@tarojs/taro';
import {
  DEFAULT_PARSE_BASE_URL,
  buildDirectUrlEndpoint,
  normalizeShareUrl,
  pickDownloadUrls,
  buildResultLines,
  DirectUrlResolveResponse,
  ResultLine,
} from '@/utils/videoParse';
import { downloadVideoToCloud, getTempFileUrl } from '@/utils/cloud';
import styles from './index.module.scss';

const PAGE_TITLE = '视频去水印';
const PAGE_SUBTITLE = '抖音 · 小红书 · B站 一键去水印';

const VideoDewatermarkPage: React.FC = () => {
  const [shareText, setShareText] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resultLines, setResultLines] = useState<ResultLine[]>([]);
  const [previewUrl, setPreviewUrl] = useState('');
  const [saving, setSaving] = useState(false);

  const handleResolve = async () => {
    const url = normalizeShareUrl(shareText);
    if (!url) {
      Taro.showToast({ title: '请输入有效的分享链接', icon: 'none' });
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setResultLines([]);
    setPreviewUrl('');

    try {
      const res = await Taro.request({
        url: buildDirectUrlEndpoint(DEFAULT_PARSE_BASE_URL),
        method: 'POST',
        timeout: 120000,
        header: { 'content-type': 'application/json' },
        data: { url },
      });

      const data = res.data as DirectUrlResolveResponse;
      if (res.statusCode < 200 || res.statusCode >= 300 || !data) {
        throw new Error(`解析失败，HTTP ${res.statusCode}`);
      }

      const lines = buildResultLines(data);
      if (data.ok === false && lines.length === 0) {
        throw new Error(data.message || '解析失败，请稍后再试');
      }
      if (lines.length === 0) {
        throw new Error('去水印失败，未获取到视频');
      }

      setResultLines(lines);
      setPreviewUrl(pickDownloadUrls(data)[0] || '');
      Taro.showToast({ title: '解析成功', icon: 'success' });
    } catch (error) {
      const message = error instanceof Error ? error.message : '解析失败，请稍后再试';
      setErrorMessage(message);
      Taro.showToast({ title: message, icon: 'none' });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setShareText('');
    setResultLines([]);
    setErrorMessage(null);
    setPreviewUrl('');
  };

  const handleCopy = (value: string) => {
    Taro.setClipboardData({
      data: value,
      success: () => {
        Taro.showToast({ title: '已复制', icon: 'success' });
      },
    });
  };

  const ensureAlbumAuth = async (): Promise<boolean> => {
    const setting = await Taro.getSetting();
    const status = setting.authSetting['scope.writePhotosAlbum'];
    if (status === true) {
      return true;
    }
    if (status === false) {
      const modal = await Taro.showModal({
        title: '需要相册权限',
        content: '保存视频需要您授权访问相册，请在设置中开启。',
        confirmText: '去设置',
      });
      if (!modal.confirm) {
        return false;
      }
      const opened = await Taro.openSetting();
      return opened.authSetting['scope.writePhotosAlbum'] === true;
    }
    try {
      await Taro.authorize({ scope: 'scope.writePhotosAlbum' });
      return true;
    } catch (e) {
      return false;
    }
  };

  const downloadCloudVideo = (fileUrl: string): Promise<string> =>
    new Promise((resolve, reject) => {
      const task = Taro.downloadFile({
        url: fileUrl,
        success: (res) => {
          if (res.statusCode === 200 && res.tempFilePath) {
            resolve(res.tempFilePath);
          } else {
            reject(new Error(`下载失败，HTTP ${res.statusCode}`));
          }
        },
        fail: (err) => reject(new Error(err.errMsg || '下载失败')),
      });
      task.progress((p) => {
        Taro.showLoading({ title: `下载中 ${p.progress}%`, mask: true });
      });
    });

  const handleSaveToAlbum = async () => {
    if (saving) {
      return;
    }
    if (!previewUrl) {
      Taro.showToast({ title: '暂无可保存的视频', icon: 'none' });
      return;
    }

    setSaving(true);
    Taro.showLoading({ title: '转存中...', mask: true });
    try {
      const authorized = await ensureAlbumAuth();
      if (!authorized) {
        Taro.showToast({ title: '未获得相册权限', icon: 'none' });
        return;
      }

      const fileId = await downloadVideoToCloud(previewUrl);
      const tempFileUrl = await getTempFileUrl(fileId);
      const localPath = await downloadCloudVideo(tempFileUrl);

      await Taro.saveVideoToPhotosAlbum({ filePath: localPath });
      Taro.showToast({ title: '已保存到相册', icon: 'success' });
    } catch (error) {
      Taro.hideLoading();
      const message = error instanceof Error ? error.message : '保存失败，请稍后再试';
      const modal = await Taro.showModal({
        title: '保存失败',
        content: `${message}\n可能是视频过大，可复制下方下载直链到浏览器手动下载。`,
        confirmText: '复制直链',
        cancelText: '取消',
      });
      if (modal.confirm) {
        Taro.setClipboardData({
          data: previewUrl,
          success: () => {
            Taro.showToast({ title: '直链已复制，请到浏览器打开', icon: 'none' });
          },
        });
      }
    } finally {
      Taro.hideLoading();
      setSaving(false);
    }
  };

  return (
    <View className={styles.container}>
      <View className={styles.glowTop} />

      <View className={styles.hero}>
        <Text className={styles.heroEyebrow}>去水印工具</Text>
        <Text className={styles.heroTitle}>{PAGE_TITLE}</Text>
        <Text className={styles.heroSubtitle}>{PAGE_SUBTITLE}</Text>
      </View>

      <View className={styles.card}>
        <Text className={styles.cardTitle}>粘贴分享链接</Text>
        <Text className={styles.cardDesc}>
          复制抖音 / 小红书 / B站 的分享文案或链接，点击下方按钮去水印。
        </Text>
        <Textarea
          className={styles.input}
          value={shareText}
          placeholder="例如：复制打开抖音，看看这个视频 https://v.douyin.com/xxxxx/"
          placeholderClass={styles.inputPlaceholder}
          maxlength={-1}
          autoHeight
          onInput={(e) => setShareText(e.detail.value)}
        />

        <View
          className={`${styles.primaryButton} ${loading ? styles.primaryButtonDisabled : ''}`}
          onClick={loading ? undefined : handleResolve}
        >
          <Text className={styles.primaryButtonText}>
            {loading ? '去水印中...' : '去水印'}
          </Text>
        </View>

        <View className={styles.secondaryButton} onClick={handleClear}>
          <Text className={styles.secondaryButtonText}>清空</Text>
        </View>
      </View>

      {errorMessage ? (
        <View className={styles.errorCard}>
          <Text className={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : null}

      {previewUrl ? (
        <View className={styles.previewCard}>
          <Text className={styles.cardTitle}>视频预览</Text>
          <Video
            className={styles.previewVideo}
            src={previewUrl}
            controls
            showFullscreenBtn
            objectFit="contain"
          />
          <View
            className={`${styles.primaryButton} ${saving ? styles.primaryButtonDisabled : ''}`}
            onClick={saving ? undefined : handleSaveToAlbum}
          >
            <Text className={styles.primaryButtonText}>
              {saving ? '保存中...' : '保存到相册'}
            </Text>
          </View>
        </View>
      ) : null}

      {resultLines.length > 0 ? (
        <View className={styles.resultCard}>
          <Text className={styles.cardTitle}>解析结果</Text>
          {resultLines.map((line) => {
            const isUrl = /^https?:\/\//i.test(line.value);
            return (
              <View className={styles.resultItem} key={`${line.label}-${line.value}`}>
                <View className={styles.resultHead}>
                  <Text className={styles.resultLabel}>{line.label}</Text>
                  <Text className={styles.copyBtn} onClick={() => handleCopy(line.value)}>
                    复制
                  </Text>
                </View>
                <Text
                  className={`${styles.resultValue} ${isUrl ? styles.resultValueUrl : ''}`}
                  selectable
                >
                  {line.value}
                </Text>
              </View>
            );
          })}
        </View>
      ) : null}
    </View>
  );
};

export default VideoDewatermarkPage;
