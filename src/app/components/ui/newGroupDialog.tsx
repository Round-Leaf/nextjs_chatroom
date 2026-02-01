import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  List, 
  ListItem, 
  ListItemButton, // 引入这个
  ListItemAvatar, 
  Avatar, 
  ListItemText, 
  Checkbox 
} from "@mui/material";
import { useState } from "react";

// 示例数据保持不变
const CONTACTS = [
  { id: 1, name: "王五", avatar: "" },
  { id: 2, name: "赵六", avatar: "" },
  { id: 3, name: "孙七", avatar: "" },
];

export function NewGroupDialog({ open, onClose }: { open: boolean, onClose: () => void }) {
  const [selected, setSelected] = useState<number[]>([]);

  const handleToggle = (id: number) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>新建群聊</DialogTitle>
      <DialogContent dividers sx={{ maxHeight: '400px', p: 0 }}> {/* p:0 让列表占满宽度 */}
        <List>
          {CONTACTS.map((contact) => (
            <ListItem 
              key={contact.id} 
              disablePadding // 移除内边距，让 ListItemButton 负责交互区域
            >
              <ListItemButton onClick={() => handleToggle(contact.id)} dense>
                <Checkbox 
                  edge="start" 
                  checked={selected.indexOf(contact.id) !== -1} 
                  tabIndex={-1}
                  disableRipple
                />
                <ListItemAvatar>
                  <Avatar src={contact.avatar}>{contact.name[0]}</Avatar>
                </ListItemAvatar>
                <ListItemText primary={contact.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button variant="contained" disabled={selected.length === 0} onClick={onClose}>
          完成 ({selected.length})
        </Button>
      </DialogActions>
    </Dialog>
  );
}