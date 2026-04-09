type ChatMode = 'bot' | 'model';

interface AgentConfig {
  botId: string;
  allowUploadFile?: boolean;
  allowWebSearch?: boolean;
  allowPullRefresh?: boolean;
  allowUploadImage?: boolean;
  allowMultiConversation?: boolean;
  showToolCallDetail?: boolean;
  allowVoice?: boolean;
  showBotName?: boolean;
  tools?: unknown[];
}

interface ModelConfig {
  modelProvider?: string;
  quickResponseModel?: string;
  deepReasoningModel?: string;
  logo?: string;
  welcomeMsg?: string;
}

interface EnvShareConfig {
  resourceAppid: string;
  resourceEnv: string;
}

const botId = __AI_BOT_ID__ || '';
const resourceAppid = __AI_RESOURCE_APPID__ || '';
const resourceEnv = __AI_RESOURCE_ENV__ || '';

const chatMode: ChatMode = 'bot';

const agentConfig: AgentConfig = {
  botId,
  allowWebSearch: true,
  allowUploadFile: true,
  allowPullRefresh: true,
  allowUploadImage: true,
  allowMultiConversation: true,
  showToolCallDetail: true,
  allowVoice: true,
  showBotName: true,
  tools: [],
};

const modelConfig: ModelConfig = {
  modelProvider: 'hunyuan-open',
  quickResponseModel: 'hunyuan-lite',
  logo: '',
  welcomeMsg: '你好，我是水果生成助手。发我一个水果名，我来帮你写简介、卖点文案和配图提示词。',
};

const envShareConfig: EnvShareConfig | undefined =
  resourceAppid && resourceEnv
    ? {
        resourceAppid,
        resourceEnv,
      }
    : undefined;

export const agentUiConfig = {
  chatMode,
  agentConfig,
  modelConfig,
  envShareConfig,
};
