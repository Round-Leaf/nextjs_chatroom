import { conversation } from "@/types/conversation"
import { Avatar, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography } from "@mui/material"
import { useState } from "react"

export function ConversationList({conversation,onClick,isSelected}:{conversation:conversation,onClick:(id:number)=>void,isSelected:boolean}){
    return <>
<ListItem disablePadding key={conversation.id}>
  <ListItemButton
    selected={isSelected}
    onClick={() => onClick(conversation.id)}
    sx={{ 
      '&.Mui-selected': { bgcolor: '#f0f2f5' },
      '&:hover': { bgcolor: '#f5f6f6' },
      transition: '0.2s'
    }}
  >
              <ListItemAvatar>
                <Avatar src={conversation.avatar_url} sx={{ width: 48, height: 48 }} />
              </ListItemAvatar>
              <ListItemText 
                primary={<Typography variant="subtitle1" fontWeight="600">{conversation.name}</Typography>}
                secondary={
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {"最后一条消息"}
                  </Typography>
                }
              />
              <Typography variant="caption" sx={{ alignSelf: 'flex-start', mt: 1, color: 'text.secondary' }}>
                {conversation.created_at}
              </Typography>
              </ListItemButton>
            </ListItem>
    </>
}