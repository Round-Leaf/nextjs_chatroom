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
import { useState } from "react";
export function MessageInput({onSend}:{onSend:(text:string)=>void}){
    const [text, setText] = useState("");
    return  (        <Box
          sx={{
            p: 2,
            bgcolor: "#f0f2f5",
            display: "flex",
            alignItems: "center",
            borderRadius: "0 0 12px 0",
          }}
        >
          <IconButton>
            <EmojiIcon />
          </IconButton>
          <IconButton sx={{ mr: 1 }}>
            <AttachFileIcon />
          </IconButton>
          <TextField
            fullWidth
            placeholder="输入消息"
            variant="outlined"
            size="small"
            value={text}
            onChange={
              (e)=>{
                setText(e.target.value);
              }
            }
            sx={{
              bgcolor: "#fff",
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
                border: "none",
              },
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
            }}
          />
          <IconButton onClick={()=>{
            onSend(text)
            setText("")
          }} color="primary" sx={{ ml: 1 }}>
            <SendIcon />
          </IconButton>
        </Box>)
}