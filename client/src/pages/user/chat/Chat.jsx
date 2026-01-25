import {
  Badge,
  Box,
  Button,
  Drawer,
  IconButton,
  Input,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useGetChatHistoryQuery } from "../../../state/api/chatApi";

const socket = io(import.meta.env.VITE_BASE_URL, { withCredentials: true });

const Chat = () => {
  const { user, isAuth } = useSelector((state) => state.auth);
  const { data: chatHistory } = useGetChatHistoryQuery(user?.username, {
    skip: !user?.username,
  });

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const isDrawerOpen = useRef(null);
  const chatEndRef = useRef(null);

  const toggleDrawer = () => {
    setOpen(!open);

    isDrawerOpen.current = !open;
    if (!open) {
      setUnreadCount(0);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();

    if (message.trim()) {
      const chatMessage = {
        message,
        sender: user?.username,
        recipient: "admin",
      };
      socket.emit("chatMessage", chatMessage);
      setMessage("");
    }
  };

  useEffect(() => {
    socket.on("chatMessage", (msg) => {
      if (msg.recipient === user?.username || msg.sender === user?.username) {
        setChat((prevChat) => [...prevChat, msg]);
      }

      if (msg.sender === "admin" && !open) {
        setUnreadCount((prevCount) => prevCount + 1);
      }
    });
  }, [user?.username]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat, chatHistory]);

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: { xs: 10, md: 20 },
        right: { xs: 10, md: 20 },
        display: isAuth && user?.role !== "admin" ? "block" : "none",
      }}
    >
      <Badge badgeContent={unreadCount} color="error">
        <Button
          variant="contained"
          color="primary"
          startIcon={<ChatIcon />}
          onClick={toggleDrawer}
        >
          krim pesan
        </Button>
      </Badge>

      <Drawer anchor="right" open={open} onClose={toggleDrawer}>
        <Box
          sx={{
            width: {
              xs: "80vw",
              md: "20vw",
            },
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: "95%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6">Hubungi Admin</Typography>
            <IconButton onClick={toggleDrawer}>
              <CloseIcon />
            </IconButton>
          </Box>

          <List sx={{ flexGrow: 1, overflowY: "auto" }}>
            {chatHistory?.length > 0 ? (
              chatHistory?.map((chatMessage, index) => (
                <ListItem
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent:
                      chatMessage.sender === "admin"
                        ? "flex-end"
                        : "flex-start",
                  }}
                >
                  <ListItemText
                    primary={chatMessage.sender}
                    secondary={chatMessage.message}
                    sx={{
                      textAlign:
                        chatMessage.sender === "admin" ? "right" : "left",
                      bgcolor:
                        chatMessage.sender === "admin" ? "#e0e0e0" : "#f5f5f5",
                      padding: 1,
                      borderRadius: 1,
                      maxWidth: "60%",
                    }}
                  />
                </ListItem>
              ))
            ) : (
              <p>Pesan belum dimulai</p>
            )}
            {chat.map((chatMessage, index) => (
              <ListItem
                key={index}
                sx={{
                  display: "flex",
                  justifyContent:
                    chatMessage.sender === "admin" ? "flex-end" : "flex-start",
                }}
              >
                <ListItemText
                  primary={chatMessage.sender}
                  secondary={chatMessage.message}
                  sx={{
                    textAlign:
                      chatMessage.sender === "admin" ? "right" : "left",
                    bgcolor:
                      chatMessage.sender === "admin" ? "#e0e0e0" : "#f5f5f5",
                    padding: 1,
                    borderRadius: 1,
                    maxWidth: "60%",
                  }}
                />
              </ListItem>
            ))}

            <div ref={chatEndRef} />
          </List>
          <form
            onSubmit={sendMessage}
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "1rem",
              gap: "1rem",
            }}
          >
            <Input
              placeholder="Tulis pesan"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<SendIcon />}
              type="submit"
            >
              Kirim pesan
            </Button>
          </form>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Chat;
