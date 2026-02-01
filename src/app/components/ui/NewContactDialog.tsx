import { Dialog, DialogTitle, DialogContent, TextField, List, ListItem, ListItemAvatar, Avatar, ListItemText, Button, Box, Typography } from "@mui/material";
import { useState } from "react";

// 示例数据
const MOCK_USERS = [
  { id: "101", name: "张三", avatar: "/api/avatar/1" },
  { id: "102", name: "李四", avatar: "/api/avatar/2" },
];

export function NewContactDialog({ open, onClose }: { open: boolean, onClose: () => void }) {
  const [searchId, setSearchId] = useState("");
  
  // 过滤示例数据
  const searchResults = MOCK_USERS.filter(u => u.id.includes(searchId) && searchId !== "");

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
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary">搜索结果</Typography>
          <List>
            {searchResults.map(user => (
              <ListItem key={user.id} secondaryAction={
                <Button size="small" variant="contained" onClick={onClose}>添加</Button>
              }>
                <ListItemAvatar>
                  <Avatar src={user.avatar} />
                </ListItemAvatar>
                <ListItemText primary={user.name} secondary={`ID: ${user.id}`} />
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