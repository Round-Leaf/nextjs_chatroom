import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { conversation } from "@/types/conversation";
import { messageWithAvatarURL } from "@/types/message";

export const useChat = (user_id: number) => {
  const [conversationList, setConversationList] = useState<conversation[]>([]);
  const [messages, setMessages] = useState<Record<number, messageWithAvatarURL[]>>({});
  const [currentConversation, setCurrentConversation] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);

  const addMessages = (incomingMessages: messageWithAvatarURL[]) => {
    setMessages((prev) => {
      const newMap = { ...prev };
      incomingMessages.forEach((msg) => {
        const cid = msg.conversation_id;
        newMap[cid] = [...(newMap[cid] || []), msg];
      });
      return newMap;
    });
  };

  // 1. 获取列表
  useEffect(() => {
    if (!user_id) return;
    axios.get("/api/get_conversation_list", { params: { user_id } })
      .then(res => setConversationList(res.data));
  }, [user_id]);

  // 2. SSE 长连接
  useEffect(() => {
    if (!user_id) return;
    const eventSource = new EventSource(`/api/stream/?user_id=${user_id}`);
    eventSource.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      addMessages([newMessage]);
    };
    return () => eventSource.close();
  }, [user_id]);

  // 3. 切换聊天时获取历史消息
  useEffect(() => {
    if (currentConversation !== -1 && !messages[currentConversation]) {
      axios.get("/api/get_messages", { params: { conversation_id: currentConversation } })
        .then(res => addMessages(res.data));
    }
  }, [currentConversation]);

  // 4. 自动滚动
  useEffect(() => {
    if (messages[currentConversation]) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, currentConversation]);

  const sendMessage = async (text: string) => {
    if (currentConversation === -1) return;
    await axios.post("/api/send_message", {
      conversation_id: currentConversation,
      user_id,
      content: text,
      type: "text",
    });
  };

  return {
    conversationList,
    messages,
    currentConversation,
    setCurrentConversation,
    sendMessage,
    scrollRef
  };
};