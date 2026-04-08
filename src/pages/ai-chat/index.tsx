import React from 'react';
import { CustomWrapper, Text, View } from '@tarojs/components';
import { agentUiConfig } from '@/config/ai';

const AiChatPage: React.FC = () => {
  const { chatMode, agentConfig, modelConfig, envShareConfig } = agentUiConfig;
  const isBotModeWithoutBotId = chatMode === 'bot' && !agentConfig.botId;

  if (isBotModeWithoutBotId) {
    return (
      <View
        style={{
          minHeight: '100vh',
          padding: '48rpx',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f7f8fa',
        }}
      >
        <View
          style={{
            width: '100%',
            padding: '40rpx 32rpx',
            borderRadius: '24rpx',
            background: '#fff',
            boxShadow: '0 12rpx 36rpx rgba(15, 23, 42, 0.08)',
          }}
        >
          <Text style={{ display: 'block', fontSize: '34rpx', fontWeight: 600, color: '#1f2937', marginBottom: '16rpx' }}>
            AI 助手尚未完成配置
          </Text>
          <Text style={{ display: 'block', fontSize: '28rpx', lineHeight: 1.8, color: '#4b5563' }}>
            当前页面已经接入微信原生 agent-ui，但 `botId` 仍为空。请在 `src/config/ai.ts` 或 `.env` 中填写真实的
            `TARO_AI_BOT_ID` 后重新编译。
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ width: '100%', minHeight: '100vh', background: '#f7f8fa' }}>
      <CustomWrapper>
        <agent-ui
          chatMode={chatMode}
          agentConfig={agentConfig}
          modelConfig={modelConfig}
          envShareConfig={envShareConfig}
          showBotAvatar
        />
      </CustomWrapper>
    </View>
  );
};

export default AiChatPage;
