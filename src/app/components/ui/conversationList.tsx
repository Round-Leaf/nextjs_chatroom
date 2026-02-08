import React, { useState } from "react";
import {
  Paper,
  Box,
  Avatar,
  IconButton,
  InputBase,
  List,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Typography
} from "@mui/material";
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  PersonAdd as PersonAddIcon,
  GroupAdd as GroupAddIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { ConversationItem } from "./conversationItem";
import { NewContactDialog } from "./NewContactDialog";
import { NewGroupDialog } from "./newGroupDialog";
import { conversation } from "@/types/conversation";
import { useSession, signOut } from "next-auth/react";

export function ConversationList({
  conversations,
  currentConversation,
  setCurrentConversation,
  setConversations
}: {
  conversations: conversation[];
  currentConversation: number;
  setCurrentConversation: React.Dispatch<React.SetStateAction<number>>;
  setConversations: React.Dispatch<React.SetStateAction<conversation[]>>
}) {
  const { data: session } = useSession();
  
  // 分别管理两个菜单的锚点
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);
  const [moreAnchor, setMoreAnchor] = useState<null | HTMLElement>(null);
  
  const [dialogOpen, setDialogOpen] = useState({ contact: false, group: false });

  const handleOpenDialog = (type: 'contact' | 'group') => {
    setDialogOpen({ ...dialogOpen, [type]: true });
    setMoreAnchor(null); // 关闭“更多”菜单
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: 350,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        borderRadius: 0,
        borderRight: "1px solid #e0e0e0",
        bgcolor: "#fff"
      }}
    >
      {/* 1. Header */}
      <Box sx={{ p: 2, flexShrink: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2, justifyContent: "space-between" }}>
          {/* 左侧头像：点击触发 profileAnchor */}
          <IconButton onClick={(e) => setProfileAnchor(e.currentTarget)} sx={{ p: 0 }}>
            <Avatar 
              src={session?.user?.image || undefined} 
              sx={{ width: 40, height: 40, border: "1px solid #f0f0f0" }}
            />
          </IconButton>

          {/* 右侧更多：点击触发 moreAnchor */}
          <IconButton onClick={(e) => setMoreAnchor(e.currentTarget)}>
            <MoreVertIcon />
          </IconButton>
        </Box>
        
        <Box sx={{ display: "flex", alignItems: "center", bgcolor: "#f0f2f5", borderRadius: "10px", px: 2, py: 0.8 }}>
          <SearchIcon sx={{ color: "gray", fontSize: 20 }} />
          <InputBase placeholder="搜索聊天..." sx={{ ml: 1, flex: 1, fontSize: "0.9rem" }} />
        </Box>
      </Box>

      {/* 2. List */}
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

      {/* --- 菜单部分 --- */}

      {/* 头像菜单：只包含 用户信息、设置、退出 */}
      <Menu
        anchorEl={profileAnchor}
        open={Boolean(profileAnchor)}
        onClose={() => setProfileAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{ sx: { width: 180, mt: 1 } }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" noWrap sx={{ fontWeight: 'bold' }}>
            {session?.user?.name || "用户"}
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={() => setProfileAnchor(null)}>
          <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
          设置
        </MenuItem>
        <MenuItem onClick={() => signOut({redirectTo:"/login"})} sx={{ color: 'error.main' }}>
          <ListItemIcon><LogoutIcon fontSize="small" sx={{ color: 'error.main' }} /></ListItemIcon>
          退出登录
        </MenuItem>
      </Menu>

      {/* 更多功能菜单：包含 新建联系人、新建群聊 */}
      <Menu
        anchorEl={moreAnchor}
        open={Boolean(moreAnchor)}
        onClose={() => setMoreAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ sx: { width: 160, mt: 1 } }}
      >
        <MenuItem onClick={() => handleOpenDialog('contact')}>
          <ListItemIcon><PersonAddIcon fontSize="small" /></ListItemIcon>
          新建联系人
        </MenuItem>
        <MenuItem onClick={() => handleOpenDialog('group')}>
          <ListItemIcon><GroupAddIcon fontSize="small" /></ListItemIcon>
          新建群聊
        </MenuItem>
      </Menu>

      {/* 弹窗组件 */}
      <NewContactDialog 
        open={dialogOpen.contact} 
        setConversations={setConversations}
        onClose={() => setDialogOpen({ ...dialogOpen, contact: false })} 
      />
      <NewGroupDialog 
        open={dialogOpen.group} 
        onClose={() => setDialogOpen({ ...dialogOpen, group: false })} 
      />
    </Paper>
  );
}