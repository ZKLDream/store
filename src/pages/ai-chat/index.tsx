import React from 'react';
import { View, Text } from '@tarojs/components';

const AiChatPage: React.FC = () => {
  return (
    <View style={{ width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: '32rpx', color: '#666' }}>正在加载 AI 助手...</Text>
    </View>
  );
};

export default AiChatPage;
