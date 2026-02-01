import React, { useState } from "react";
import { Paper, Box, Avatar, IconButton, InputBase, List, Menu, MenuItem, ListItemIcon } from "@mui/material";
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  PersonAdd as PersonAddIcon,
  GroupAdd as GroupAddIcon,
} from "@mui/icons-material";
import { ConversationItem } from "./conversationItem";
import { NewContactDialog } from "./NewContactDialog";
import { NewGroupDialog } from "./newGroupDialog";
import { conversation } from "@/types/conversation";
import {useSession} from "next-auth/react"

export function ConversationList({
  conversations,
  currentConversation,
  setCurrentConversation,
}: {
  conversations: conversation[];
  currentConversation: number;
  setCurrentConversation: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = useState({ contact: false, group: false });
  const { data: session } = useSession()

  const handleOpenDialog = (type: 'contact' | 'group') => {
    setDialogOpen({ ...dialogOpen, [type]: true });
    setAnchorEl(null);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: 350,
        height: "100vh", // 重要：确保侧边栏占据全屏高度
        display: "flex",
        flexDirection: "column",
        borderRadius: 0, 
        borderRight: "1px solid #e0e0e0",
        bgcolor: "#fff"
      }}
    >
      {/* 1. 顶部固定区域 (Header + Search) */}
      <Box sx={{ p: 2, flexShrink: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2, justifyContent: "space-between" }}>
          <Avatar src="/api/avatar/me" />
          {
            session?.user?.name
          }
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <MoreVertIcon />
          </IconButton>
        </Box>
        
        <Box sx={{ display: "flex", alignItems: "center", bgcolor: "#f0f2f5", borderRadius: "10px", px: 2, py: 0.5 }}>
          <SearchIcon sx={{ color: "gray", fontSize: 20 }} />
          <InputBase placeholder="搜索聊天..." sx={{ ml: 1, flex: 1, fontSize: "0.9rem" }} />
        </Box>
      </Box>

      {/* 2. 滚动区域 (Conversation List) */}
      <Box sx={{ flex: 1, overflowY: "auto", borderTop: "1px solid #f0f2f5" }}>
        <List sx={{ py: 0 }}>
          {conversations.map((chat) => (
            <ConversationItem
              key={chat.id}
              conversation={chat}
              isSelected={chat.id === currentConversation}
              onClick={(id) => setCurrentConversation(id)}
            />
          ))}
        </List>
      </Box>

      {/* 菜单与弹窗 */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={() => handleOpenDialog('contact')}>
          <ListItemIcon><PersonAddIcon fontSize="small" /></ListItemIcon>
          新建联系人
        </MenuItem>
        <MenuItem onClick={() => handleOpenDialog('group')}>
          <ListItemIcon><GroupAddIcon fontSize="small" /></ListItemIcon>
          新建群聊
        </MenuItem>
      </Menu>

      <NewContactDialog 
        open={dialogOpen.contact} 
        onClose={() => setDialogOpen({ ...dialogOpen, contact: false })} 
      />
      <NewGroupDialog 
        open={dialogOpen.group} 
        onClose={() => setDialogOpen({ ...dialogOpen, group: false })} 
      />
    </Paper>
  );
}