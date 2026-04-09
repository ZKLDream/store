import React from 'react';
import { Text, View } from '@tarojs/components';
import { agentUiConfig } from '@/config/ai';
import styles from './index.module.scss';

const AI_PAGE_TITLE = '水果生成助手';
const AI_PAGE_SUBTITLE = '商品简介 / 卖点文案 / 配图提示词';

const AiChatPage: React.FC = () => {
  const { chatMode, agentConfig, modelConfig, envShareConfig } = agentUiConfig;
  const isBotModeWithoutBotId = chatMode === 'bot' && !agentConfig.botId;

  if (isBotModeWithoutBotId) {
    return (
      <View className={styles.container}>
        <View className={styles.backgroundGlowTop} />
        <View className={styles.backgroundGlowBottom} />
        <View className={styles.content}>
          <View className={styles.heroCard}>
            <Text className={styles.heroEyebrow}>AI 助手</Text>
            <Text className={styles.heroTitle}>{AI_PAGE_TITLE}</Text>
            <Text className={styles.heroSubtitle}>{AI_PAGE_SUBTITLE}</Text>
          </View>

          <View className={styles.configCard}>
            <Text className={styles.configTitle}>AI 助手尚未完成配置</Text>
            <Text className={styles.configText}>
              当前页面已经接入微信原生 agent-ui，但 `botId` 仍为空。请在 `src/config/ai.ts` 或 `.env` 中填写真实的
              `TARO_AI_BOT_ID` 后重新编译。
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.container}>
      <View className={styles.backgroundGlowTop} />
      <View className={styles.backgroundGlowBottom} />

      <View className={styles.content}>
        <View className={styles.heroCard}>
          <View className={styles.heroBadgeRow}>
            <Text className={styles.heroEyebrow}>AI 助手</Text>
            <Text className={styles.heroChip}>灵感生成</Text>
          </View>
          <Text className={styles.heroTitle}>{AI_PAGE_TITLE}</Text>
          <Text className={styles.heroSubtitle}>{AI_PAGE_SUBTITLE}</Text>
          <Text className={styles.heroHint}>
            {modelConfig.welcomeMsg || '输入一个水果名，立即生成可直接使用的展示文案。'}
          </Text>
        </View>

        <View className={styles.chatShell}>
          <View className={styles.chatShellHeader}>
            <View>
              <Text className={styles.chatShellTitle}>对话工作台</Text>
              <Text className={styles.chatShellDesc}>发送水果名称，快速生成文案与图片提示词</Text>
            </View>
          </View>

          <View className={styles.chatPanel}>
            <View className={styles.chatPanelBody}>
              <agent-ui
                chatMode={chatMode}
                agentConfig={agentConfig}
                modelConfig={modelConfig}
                envShareConfig={envShareConfig}
                showBotAvatar
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default AiChatPage;
