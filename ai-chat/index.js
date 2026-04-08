Page({
  data: {
    chatMode: "bot",
    showBotAvatar: true,
    agentConfig: {
      botId: "",
      allowWebSearch: true,
      allowUploadFile: true,
      allowPullRefresh: true,
      allowUploadImage: true,
      allowMultiConversation: true,
      showToolCallDetail: true,
      allowVoice: true,
      showBotName: true,
    },
    modelConfig: {
      modelProvider: "hunyuan-open",
      quickResponseModel: "hunyuan-lite",
      logo: "",
      welcomeMsg: "你好，我是你的 AI 助手，有什么可以帮你的吗？",
    },
  },

  onLoad: function (options) {
    console.log('AI Chat Page loaded');
  },
});
