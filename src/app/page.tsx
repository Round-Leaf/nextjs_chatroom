"use client";
import React, { useEffect, useState,useRef } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Divider,
  TextField,
  IconButton,
  Paper,
  InputBase,
  Container,
} from "@mui/material";
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  InsertEmoticon as EmojiIcon,
} from "@mui/icons-material";
import { useSearchParams } from "next/navigation";
import { ConversationList } from "./components/ui/conversation-list";
import { conversation } from "@/types/conversation";
import axios from "axios";
import { message, messageWithAvatarURL } from "@/types/message";
import { getAvatarUrl, getConversationList } from "./lib/actions";
import Message from "./components/ui/message";
import { MessageInput } from "./components/ui/messageInput";
// 示例数据

// const chatHistory:conversation[] = [
//   { id: 1, name: 'Alice Smith', lastMsg: '明天几点出发？', created_at: '14:20', avatar_url: 'https://i.pravatar.cc/150?u=1' },
//   { id: 2, name: 'React 开发者群', lastMsg: '有人知道 MUI 的最新版吗？', created_at: '13:05', avatar_url: 'https://i.pravatar.cc/150?u=2' },
//   { id: 3, name: 'Stellantis Recruiter', lastMsg: 'Nous avons bien reçu votre email.', created_at: '昨天', avatar_url: 'https://i.pravatar.cc/150?u=3' },
// ];

// const MESSAGES = [
//   {
//     id: 1,
//     sender: "Alice",
//     text: "你好！最近怎么样？",
//     time: "14:15",
//     isMe: false,
//   },
//   {
//     id: 2,
//     sender: "Me",
//     text: "还不错，正在用 MUI 写一个聊天室 Demo。",
//     time: "14:16",
//     isMe: true,
//   },
//   {
//     id: 3,
//     sender: "Alice",
//     text: "听起来很酷！是用 Material Design 风格吗？",
//     time: "14:18",
//     isMe: false,
//   },
//   {
//     id: 4,
//     sender: "Me",
//     text: "是的，非常优雅精致。",
//     time: "14:19",
//     isMe: true,
//   },
// ];

const ChatRoom = () => {
  const [conversationList, setConversationList] = useState<conversation[]>([]);
  const [messages,setMessages] = useState<messageWithAvatarURL[]>([]);
  const [currentConversation, setCurrentConversation] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const user_id = Number(searchParams.get("user_id"));
  const sendMessage = async(text:string)=>{
    const conversation_id = currentConversation;
    const content = text;
    const type = "text";
    //发送信息
    await axios.post("/api/send_message",{
      conversation_id,
      user_id,
      content,
      type
    });
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }
  const getMessages = (conversation_id:number)=>{
    axios
      .get("/api/get_messages",{
        params:{
          conversation_id
        }
      }).then((reponse)=>{
        setMessages((prev)=>[...prev,...reponse.data]);
      })
  }
  useEffect(() => {
    //获取聊天列表
    axios
      .get("/api/get_conversation_list", {
        params: {
          user_id: user_id,
        },
      })
      .then((response) => {
        setConversationList(response.data);
        for(let conversation of response.data){
          getMessages(conversation.id);
        }
      });
      
  }, []);
  useEffect(()=>{
    //建立长连接获取新聊天
    const eventSource = new EventSource("/api/stream/?user_id="+user_id);
    eventSource.onmessage = (event)=>{
      const newMessage = JSON.parse(event.data);
      setMessages((prev) => [...prev, newMessage]);
    }
    return ()=>eventSource.close();
  },[])
  useEffect(()=>{
    //scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    //console.log(messages)
  },[messages]);
  useEffect(()=>{
    //获取信息记录
    //getMessages();
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  },[currentConversation]);
  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#f0f2f5", p: 2 }}>
      {/* 左侧：聊天列表 */}
      <Paper
        elevation={0}
        sx={{
          width: 350,
          display: "flex",
          flexDirection: "column",
          borderRadius: "12px 0 0 12px",
          borderRight: "1px solid #e0e0e0",
        }}
      >
        {/* 顶部搜索栏 */}
        <Box sx={{ p: 2, bgcolor: "#fff", borderRadius: "12px 0 0 0" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 2,
              justifyContent: "space-between",
            }}
          >
            <Avatar src={"/api/get_avatar_url?user_id="+user_id} />
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: "#f0f2f5",
              borderRadius: "10px",
              px: 2,
            }}
          >
            <SearchIcon sx={{ color: "gray", fontSize: 20 }} />
            <InputBase
              placeholder="搜索聊天..."
              sx={{ ml: 1, flex: 1, fontSize: "0.9rem" }}
            />
          </Box>
        </Box>

        <List sx={{ flex: 1, overflowY: "auto", py: 0 }}>
          {conversationList.map((chat) => (
            <ConversationList
              key={chat.id}
              conversation={chat}
              isSelected={chat.id == currentConversation}
              onClick={(id) => {
                setCurrentConversation(id);

              }}
            ></ConversationList>
          ))}
        </List>
      </Paper>

      {/* 右侧：对话窗口 */}
      <Paper
        elevation={0}
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          borderRadius: "0 12px 12px 0",
          position: "relative",
        }}
      >
        {/* 对话框头部 */}
        <Box
          sx={{
            p: "10px 20px",
            display: "flex",
            alignItems: "center",
            borderBottom: "1px solid #e0e0e0",
            bgcolor: "#fff",
            borderRadius: "0 12px 0 0",
          }}
        >
          <Avatar
            src={conversationList.find((c) => c.id === currentConversation)?.avatar_url}
            sx={{ mr: 2 }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" fontWeight="600">
              {conversationList.find((c) => c.id === currentConversation)?.name}
            </Typography>
            <Typography variant="caption" color="success.main">
              在线
            </Typography>
          </Box>
          <IconButton>
            <SearchIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </Box>

        {/* 聊天内容区 */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 3,
            bgcolor: "#e5ddd5", // WhatsApp 经典的浅色底纹色
            backgroundImage:
              'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', // 墙纸图案
            backgroundRepeat: "repeat",
          }}
        >
          {messages.filter((message)=>message.conversation_id==currentConversation).map((msg) => {
            return <Message key={msg.id} msg={msg} isMe={msg.user_id==user_id} avatar_url={msg.avatar_url} ></Message>
        })}

        <div ref={scrollRef}></div>
        </Box>

        {/* 底部输入框 */}
        <MessageInput onSend={(text:string)=>{
          sendMessage(text);
          scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
        }}></MessageInput>
      </Paper>
    </Box>
  );
};

export default ChatRoom;
