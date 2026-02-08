'use client'
import { searchUser } from "@/app/lib/actions";
import { conversation } from "@/types/conversation";
import { user } from "@/types/user";
import { Dialog, DialogTitle, DialogContent, TextField, List, ListItem, ListItemAvatar, Avatar, ListItemText, Button, Box, Typography } from "@mui/material";
import axios from "axios";
import { useState } from "react";

// 示例数据
const MOCK_USERS = [
  { id: "101", name: "张三", avatar: "/api/avatar/1" },
  { id: "102", name: "李四", avatar: "/api/avatar/2" },
];

export function NewContactDialog({ open, onClose,setConversations }: { open: boolean, onClose: () => void,setConversations:React.Dispatch<React.SetStateAction<conversation[]>> }) {
  const searchId=1;
  // 过滤示例数据
  const [searchResults,setSearchResults] = useState<user[]>([]);

  async function handleSearch(value: string) {
    const usersResult = await axios.get("/api/search_user",{
      params:{
        keyword:value
      }
    })
    setSearchResults(usersResult.data);
  }

  function addContact(id: number) {
    axios.post("/api/add_conversation",{
      type:"private",
      members:[id]
    }).then((response)=>{
      //setConversations((prev)=>[...prev,response.data.conversation]);
    })
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>新建联系人</DialogTitle>
      <DialogContent sx={{ minHeight: '300px' }}>
        <TextField
          autoFocus
          margin="dense"
          label="通过用户 ID 搜索"
          fullWidth
          variant="outlined"
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
        />
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary">搜索结果</Typography>
          <List>
            {searchResults.map(user => (
              <ListItem key={user.id} secondaryAction={
                <Button size="small" variant="contained" onClick={()=>{addContact(user.id);onClose();}}>添加</Button>
              }>
                <ListItemAvatar>
                  <Avatar src={user.avatar_url} />
                </ListItemAvatar>
                <ListItemText primary={user.username} secondary={`ID: ${user.id}`} />
              </ListItem>
            ))}
            {searchId && searchResults.length === 0 && (
              <Typography sx={{ p: 2, textAlign: 'center' }} color="gray">未找到该用户</Typography>
            )}
          </List>
        </Box>
      </DialogContent>
    </Dialog>
  );
}