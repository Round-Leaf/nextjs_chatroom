"use client";
import React from "react";
import { Box, Paper, Avatar, Typography, IconButton } from "@mui/material";
import { Search as SearchIcon, MoreVert as MoreVertIcon } from "@mui/icons-material";
import { useSearchParams } from "next/navigation";

import Message from "./components/ui/message";
import { MessageInput } from "./components/ui/messageInput";
import { ConversationList } from "./components/ui/conversationList";
import { useChat } from "@/hooks/useChat";

const ChatRoom = () => {
  const searchParams = useSearchParams();
  const user_id = Number(searchParams.get("user_id"));

  // 使用自定义 Hook 抽离所有复杂逻辑
  const {
    conversationList,
    messages,
    currentConversation,
    setCurrentConversation,
    sendMessage,
    scrollRef,
  } = useChat(user_id);

  const activeChat = conversationList.find((c) => c.id === currentConversation);

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#f0f2f5", p: 2 }}>
      {/* 左侧列表 */}
      <ConversationList
        conversations={conversationList}
        currentConversation={currentConversation}
        setCurrentConversation={setCurrentConversation}
      />

      {/* 右侧对话窗口 */}
      <Paper
        elevation={0}
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          borderRadius: "0 12px 12px 0",
          overflow: "hidden",
        }}
      >
        {/* 头部组件化 (可进一步拆分) */}
        <ChatHeader activeChat={activeChat} />

        {/* 聊天内容区 */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 3,
            bgcolor: "#e5ddd5",
            backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")',
            backgroundRepeat: "repeat",
          }}
        >
          {messages[currentConversation]?.map((msg) => (
            <Message
              key={msg.id}
              msg={msg}
              isMe={msg.user_id === user_id}
              avatar_url={msg.avatar_url}
            />
          ))}
          <div ref={scrollRef} style={{ float: "left", clear: "both" }} />
        </Box>

        {/* 底部输入框 */}
        <MessageInput onSend={sendMessage} />
      </Paper>
    </Box>
  );
};

// 辅助子组件：头部
const ChatHeader = ({ activeChat }: { activeChat?: any }) => (
  <Box sx={{ p: "10px 20px", display: "flex", alignItems: "center", borderBottom: "1px solid #e0e0e0", bgcolor: "#fff" }}>
    <Avatar src={activeChat?.avatar_url} sx={{ mr: 2 }} />
    <Box sx={{ flex: 1 }}>
      <Typography variant="subtitle1" fontWeight="600">
        {activeChat?.name || "选择联系人"}
      </Typography>
      {activeChat && <Typography variant="caption" color="success.main">在线</Typography>}
    </Box>
    <IconButton><SearchIcon /></IconButton>
    <IconButton><MoreVertIcon /></IconButton>
  </Box>
);

export default ChatRoom;