import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, ScrollView, Textarea } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import {
  getClientId,
  getStoredSessionId,
  persistSessionId,
  clearStoredSessionId,
  fetchChatHistory,
  sendChatMessage,
  formatChatTime,
} from '@/utils/freshChat';
import styles from './index.module.scss';

interface ChatMessage {
  id: number;
  role: 'user' | 'agent';
  content: string;
  time: string;
}

const WELCOME_MESSAGE = `你好，我已经准备好了。

你可以直接发一句需求、一个想法，或者一段待整理的文字；我会结合当前会话内容，给出清晰、自然的回复。`;

const NEW_SESSION_MESSAGE = `我们开始一个新会话吧。

直接告诉我你的问题、目标或上下文，我会接着往下处理。`;

const starterPrompts = [
  '帮我把这段需求整理成清晰的任务清单',
  '把下面这条消息润色得更自然一些',
  '我想做一个周报摘要，先给我一个框架',
  '总结一下今天对话里的重点结论',
];

const FreshChatPage: React.FC = () => {
  const clientId = useMemo(() => getClientId(), []);
  const messageIdRef = useRef(2);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState('');
  const [sessionId, setSessionId] = useState(() => getStoredSessionId(clientId));
  const [scrollTop, setScrollTop] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, role: 'agent', content: WELCOME_MESSAGE, time: '09:41' },
  ]);

  const backBtnTop = useMemo(() => {
    try {
      const rect = Taro.getMenuButtonBoundingClientRect();
      if (rect && rect.top > 0) {
        return rect.top;
      }
    } catch (e) {}
    try {
      const sys = Taro.getSystemInfoSync();
      return (sys.statusBarHeight || 20) + 8;
    } catch (e) {}
    return 44;
  }, []);

  const statusText = useMemo(() => {
    if (isTyping) return '生成中';
    if (error) return '调用失败';
    return '已连接';
  }, [isTyping, error]);

  const subtitle = useMemo(() => {
    if (isTyping) return '助手正在整理你的内容并生成回复';
    if (error) return error;
    if (sessionId) return '继续当前会话';
    return '首次发送后会创建独立会话';
  }, [isTyping, error, sessionId]);

  useEffect(() => {
    setScrollTop((prev) => prev + 100000);
  }, [messages, isTyping]);

  useDidShow(() => {
    if (!sessionId) return;
    let cancelled = false;
    fetchChatHistory(sessionId)
      .then((history) => {
        if (cancelled || history.length === 0) return;
        const next = history.map((m, index) => ({
          id: index + 1,
          role: (m.role === 'assistant' ? 'agent' : 'user') as 'agent' | 'user',
          content: m.content || '',
          time: formatChatTime(m.timestamp),
        }));
        setMessages(next);
        messageIdRef.current = next.length + 1;
        setError('');
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  });

  const handleBack = () => {
    Taro.navigateBack();
  };

  const handleResetSession = () => {
    clearStoredSessionId(clientId);
    setSessionId('');
    setError('');
    setMessages([
      { id: 1, role: 'agent', content: NEW_SESSION_MESSAGE, time: formatChatTime() },
    ]);
    messageIdRef.current = 2;
  };

  const handleSend = async (rawText: string) => {
    const text = rawText.trim();
    if (!text || isTyping) return;

    const userMessage: ChatMessage = {
      id: messageIdRef.current++,
      role: 'user',
      content: text,
      time: formatChatTime(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setError('');

    try {
      const activeSessionId = sessionId || `claude-${clientId}`;
      const result = await sendChatMessage(text, activeSessionId);
      const resolvedSessionId = result.session_id || activeSessionId;
      persistSessionId(clientId, resolvedSessionId);
      setSessionId(resolvedSessionId);

      const agentMessage: ChatMessage = {
        id: messageIdRef.current++,
        role: 'agent',
        content: result.stdout || '接口返回了空内容。',
        time: formatChatTime(),
      };
      setMessages((prev) => [...prev, agentMessage]);
    } catch (err) {
      const message = err instanceof Error ? err.message : '接口调用失败';
      setError(message);
      Taro.showToast({ title: message, icon: 'none' });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <View className={styles.page}>
      <View className={styles.topbar} style={{ paddingTop: `${backBtnTop}px` }}>
        <View className={styles.backBtn} onClick={handleBack}>
          <Text className={styles.backArrow}>‹</Text>
          <Text className={styles.backLabel}>返回</Text>
        </View>
        <View className={styles.titleWrap}>
          <Text className={styles.title}>清风助手</Text>
          <Text className={styles.subtitle}>{subtitle}</Text>
        </View>
        <View className={styles.statusPill}>
          <View className={`${styles.statusDot} ${error ? styles.statusDotError : ''}`} />
          <Text className={styles.statusText}>{statusText}</Text>
        </View>
      </View>

      <ScrollView
        className={styles.messages}
        scrollY
        scrollTop={scrollTop}
        scrollWithAnimation
      >
        {messages.length <= 1 && (
          <View className={styles.welcome}>
            <Text className={styles.welcomeTitle}>把想法说出来，把结果接回来。</Text>
            <Text className={styles.welcomeText}>
              直接发一句需求、一个想法，或一段待整理的文字，我会给出清晰、自然的回复。
            </Text>
            <View className={styles.promptRow}>
              {starterPrompts.map((prompt) => (
                <View
                  key={prompt}
                  className={styles.promptChip}
                  onClick={() => handleSend(prompt)}
                >
                  <Text className={styles.promptChipText}>{prompt}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {messages.map((message) => {
          const isUser = message.role === 'user';
          return (
            <View
              key={message.id}
              className={`${styles.row} ${isUser ? styles.rowUser : styles.rowAgent}`}
            >
              {!isUser && (
                <View className={styles.avatar}>
                  <Text className={styles.avatarText}>清风</Text>
                </View>
              )}
              <View className={styles.bubbleWrap}>
                <View className={styles.meta}>
                  <Text className={styles.metaName}>{isUser ? '你' : '清风助手'}</Text>
                  <Text className={styles.metaTime}>{message.time}</Text>
                </View>
                <View
                  className={`${styles.bubble} ${isUser ? styles.bubbleUser : styles.bubbleAgent}`}
                >
                  <Text className={styles.bubbleText}>{message.content}</Text>
                </View>
              </View>
            </View>
          );
        })}

        {isTyping && (
          <View className={`${styles.row} ${styles.rowAgent}`}>
            <View className={styles.avatar}>
              <Text className={styles.avatarText}>清风</Text>
            </View>
            <View className={styles.bubbleWrap}>
              <View className={styles.meta}>
                <Text className={styles.metaName}>清风助手</Text>
                <Text className={styles.metaTime}>正在回复</Text>
              </View>
              <View className={`${styles.bubble} ${styles.bubbleAgent} ${styles.typing}`}>
                <View className={styles.typingDot} />
                <View className={styles.typingDot} />
                <View className={styles.typingDot} />
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <View className={styles.composer}>
        <Textarea
          className={styles.textarea}
          value={input}
          onInput={(e) => setInput(e.detail.value)}
          placeholder="输入你的消息…"
          maxlength={-1}
          autoHeight
          adjustPosition
        />
        <View className={styles.composerBar}>
          <View className={styles.resetBtn} onClick={handleResetSession}>
            <Text className={styles.resetText}>新建会话</Text>
          </View>
          <View
            className={`${styles.sendBtn} ${!input.trim() || isTyping ? styles.sendBtnDisabled : ''}`}
            onClick={() => handleSend(input)}
          >
            <Text className={styles.sendText}>{isTyping ? '回复中…' : '发送'}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default FreshChatPage;
