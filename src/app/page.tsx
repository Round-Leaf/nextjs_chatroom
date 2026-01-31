'use client'
import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  InsertEmoticon as EmojiIcon,
} from '@mui/icons-material';
import { useSearchParams } from 'next/navigation';
import { ConversationList } from './components/ui/conversation-list';
import { conversation } from '@/types/conversation';
import axios from "axios"
// 示例数据

// const chatHistory:conversation[] = [
//   { id: 1, name: 'Alice Smith', lastMsg: '明天几点出发？', created_at: '14:20', avatar_url: 'https://i.pravatar.cc/150?u=1' },
//   { id: 2, name: 'React 开发者群', lastMsg: '有人知道 MUI 的最新版吗？', created_at: '13:05', avatar_url: 'https://i.pravatar.cc/150?u=2' },
//   { id: 3, name: 'Stellantis Recruiter', lastMsg: 'Nous avons bien reçu votre email.', created_at: '昨天', avatar_url: 'https://i.pravatar.cc/150?u=3' },
// ];

const MESSAGES = [
  { id: 1, sender: 'Alice', text: '你好！最近怎么样？', time: '14:15', isMe: false },
  { id: 2, sender: 'Me', text: '还不错，正在用 MUI 写一个聊天室 Demo。', time: '14:16', isMe: true },
  { id: 3, sender: 'Alice', text: '听起来很酷！是用 Material Design 风格吗？', time: '14:18', isMe: false },
  { id: 4, sender: 'Me', text: '是的，非常优雅精致。', time: '14:19', isMe: true },
];

const ChatRoom = () => {
  const [activeChat, setActiveChat] = useState(1);
  const [chatHistory,setChatHistory] = useState<conversation[]>([]);
  const [currentConversation,setCurrentConversation] = useState(-1);
  const searchParams = useSearchParams();
  const user_id = searchParams.get("user_id");

  useEffect(()=>{
    axios.get("/api/get_conversation_list",{
      params:{
        user_id:user_id
      }
    }).then((response)=>{
      console.log(response.data)
      setChatHistory(response.data);
    })
  },[]);
  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#f0f2f5', p: 2 }}>
      {/* 左侧：聊天列表 */}
      <Paper elevation={0} sx={{ width: 350, display: 'flex', flexDirection: 'column', borderRadius: '12px 0 0 12px', borderRight: '1px solid #e0e0e0' }}>
        {/* 顶部搜索栏 */}
        <Box sx={{ p: 2, bgcolor: '#fff', borderRadius: '12px 0 0 0' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'space-between' }}>
            <Avatar src="https://i.pravatar.cc/150?u=me" />
            <IconButton><MoreVertIcon /></IconButton>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#f0f2f5', borderRadius: '10px', px: 2 }}>
            <SearchIcon sx={{ color: 'gray', fontSize: 20 }} />
            <InputBase placeholder="搜索聊天..." sx={{ ml: 1, flex: 1, fontSize: '0.9rem' }} />
          </Box>
        </Box>
        
        <List sx={{ flex: 1, overflowY: 'auto', py: 0 }}>
          {chatHistory.map((chat) => <ConversationList key={chat.id} conversation={chat} isSelected={chat.id==currentConversation} onClick={(id)=>{setCurrentConversation(id);console.log(id)}}></ConversationList>)}
        </List>
      </Paper>

      {/* 右侧：对话窗口 */}
      <Paper elevation={0} sx={{ flex: 1, display: 'flex', flexDirection: 'column', borderRadius: '0 12px 12px 0', position: 'relative' }}>
        {/* 对话框头部 */}
        <Box sx={{ p: '10px 20px', display: 'flex', alignItems: 'center', borderBottom: '1px solid #e0e0e0', bgcolor: '#fff', borderRadius: '0 12px 0 0' }}>
          <Avatar src={chatHistory.find(c => c.id === activeChat)?.avatar} sx={{ mr: 2 }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" fontWeight="600">
              {chatHistory.find(c => c.id === activeChat)?.name}
            </Typography>
            <Typography variant="caption" color="success.main">在线</Typography>
          </Box>
          <IconButton><SearchIcon /></IconButton>
          <IconButton><MoreVertIcon /></IconButton>
        </Box>

        {/* 聊天内容区 */}
        <Box sx={{ 
          flex: 1, 
          overflowY: 'auto', 
          p: 3, 
          bgcolor: '#e5ddd5', // WhatsApp 经典的浅色底纹色
          backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', // 墙纸图案
          backgroundRepeat: 'repeat'
        }}>
          {MESSAGES.map((msg) => (
            <Box key={msg.id} sx={{ display: 'flex', justifyContent: msg.isMe ? 'flex-end' : 'flex-start', mb: 2 }}>
              {!msg.isMe && <Avatar src={chatHistory.find(c => c.id === activeChat)?.avatar} sx={{ width: 32, height: 32, mr: 1, mt: 1 }} />}
              <Box sx={{ 
                maxWidth: '60%', 
                p: '8px 12px', 
                borderRadius: msg.isMe ? '12px 0 12px 12px' : '0 12px 12px 12px',
                bgcolor: msg.isMe ? '#dcf8c6' : '#fff',
                boxShadow: '0 1px 0.5px rgba(0,0,0,0.13)',
                position: 'relative'
              }}>
                <Typography variant="body1" sx={{ color: '#303030' }}>{msg.text}</Typography>
                <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', mt: 0.5, color: 'text.secondary', fontSize: '0.7rem' }}>
                  {msg.time}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* 底部输入框 */}
        <Box sx={{ p: 2, bgcolor: '#f0f2f5', display: 'flex', alignItems: 'center', borderRadius: '0 0 12px 0' }}>
          <IconButton><EmojiIcon /></IconButton>
          <IconButton sx={{ mr: 1 }}><AttachFileIcon /></IconButton>
          <TextField 
            fullWidth 
            placeholder="输入消息" 
            variant="outlined"
            size="small"
            sx={{ 
              bgcolor: '#fff', 
              '& .MuiOutlinedInput-root': { borderRadius: '20px', border: 'none' },
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
            }}
          />
          <IconButton color="primary" sx={{ ml: 1 }}><SendIcon /></IconButton>
        </Box>
      </Paper>
    </Box>
  );
};

export default ChatRoom;