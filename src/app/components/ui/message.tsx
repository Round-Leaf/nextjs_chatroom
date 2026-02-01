import { message } from "@/types/message";
import { Box, Avatar, Typography } from "@mui/material";

export default function Message({ msg,isMe,avatar_url }: { msg: message,isMe:boolean,avatar_url:string }) {
  return (
    <>
      <Box
        key={msg.id}
        sx={{
          display: "flex",
          justifyContent: isMe ? "flex-end" : "flex-start",
          mb: 2,
        }}
      >
        {!isMe && (
          <Avatar
            src={avatar_url}
            sx={{ width: 32, height: 32, mr: 1, mt: 1 }}
          />
        )}
        <Box
          sx={{
            maxWidth: "60%",
            p: "8px 12px",
            borderRadius: isMe ? "12px 0 12px 12px" : "0 12px 12px 12px",
            bgcolor: isMe ? "#dcf8c6" : "#fff",
            boxShadow: "0 1px 0.5px rgba(0,0,0,0.13)",
            position: "relative",
          }}
        >
          <Typography variant="body1" sx={{ color: "#303030" }}>
            {msg.content}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              display: "block",
              textAlign: "right",
              mt: 0.5,
              color: "text.secondary",
              fontSize: "0.7rem",
            }}
          >
            {msg.created_at}
          </Typography>
        </Box>
      </Box>
    </>
  );
}
