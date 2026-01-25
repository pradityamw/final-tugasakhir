import React, { Fragment, useEffect, useRef, useState } from "react";
import Title from "../../../components/title/Title";
import AdminBar from "../components/appbar/AdminBar";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Grid,
  Input,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useGetUsersQuery } from "../../../state/api/userApi";
import SendIcon from "@mui/icons-material/Send";
import { io } from "socket.io-client";
import { useGetChatHistoryQuery } from "../../../state/api/chatApi";

const socket = io(import.meta.env.VITE_BASE_URL, { withCredentials: true });

const ChatPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [unreadChat, setUnreadCount] = useState({});
  const chatEndRef = useRef(null);

  const { data } = useGetUsersQuery();
  const { data: chatHistory } = useGetChatHistoryQuery(selectedUser?.username, {
    skip: !selectedUser?.username,
  });

  useEffect(() => {
    socket.on("chatMessage", (msg) => {
      if (msg.recipient === "admin" || msg.sender === "admin") {
        setChat((prevChat) => [...prevChat, msg]);

        if (msg.sender !== "admin" && msg.sender !== selectedUser?.username) {
          setUnreadCount((prevUnread) => ({
            ...prevUnread,
            [msg.sender]: (prevUnread[msg.sender] || 0) + 1,
          }));
        }
      }
    });
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();

    if (message.trim()) {
      const chatMessage = {
        message,
        sender: "admin",
        recipient: selectedUser?.username,
      };
      socket.emit("chatMessage", chatMessage);
      setMessage("");
    }
  };

  const filteredChat = chat.filter(
    (chatMessage) =>
      chatMessage.sender === selectedUser?.username ||
      chatMessage.recipient === selectedUser?.username
  );

  const getUnreadCount = (username) => {
    return unreadChat[username] || 0;
  };

  const handlerUser = (user) => {
    setSelectedUser(user);

    setUnreadCount((prevUnread) => ({
      ...prevUnread,
      [user.username]: 0,
    }));
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat, chatHistory]);

  return (
    <Fragment>
      <Title title={"Pesan"} />
      <AdminBar />

      <Box sx={{ position: "relative", top: 80 }}>
        <Grid container>
          <Grid item md={3} sx={{ p: 2, maxHeight: "80vh", overflow: "auto" }}>
            {data?.map((user) => (
              <Box
                key={user?._id}
                sx={{
                  m: 1,
                  p: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  boxShadow: 4,
                  borderRadius: 1,
                  "&:hover": { cursor: "pointer" },
                  transform:
                    selectedUser?.username === user?.username
                      ? "scale(1.05)"
                      : "scale(1)",
                  transition: "transform 0.3s ease-in-out",
                }}
                onClick={() => handlerUser(user)}
              >
                <Box
                  sx={{
                    width: "5px",
                    height: 50,
                    borderRadius: 2,
                    bgcolor:
                      selectedUser?.username === user?.username
                        ? "red"
                        : "none",
                  }}
                />
                {selectedUser?.username !== user?.username && (
                  <Badge
                    badgeContent={getUnreadCount(user.username)}
                    color="error"
                  >
                    <Avatar src={user?.avatar} alt={user?.name} />
                  </Badge>
                )}
                {selectedUser?.username === user?.username && (
                  <Avatar src={user?.avatar} alt={user?.name} />
                )}
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography fontSize={12}>{user?.name}</Typography>
                  <Typography fontSize={12}>{user?.username}</Typography>
                  <Typography fontSize={12}>{user?.phone}</Typography>
                </Box>
              </Box>
            ))}
          </Grid>

          <Grid item md={9} sx={{ p: 2, height: "80vh" }}>
            <Box
              sx={{
                height: "90%",
                overflow: "auto",
                p: 1,
                borderRadius: 1,
                boxShadow: 4,
              }}
            >
              {selectedUser ? (
                <List>
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
                              chatMessage.sender === "admin"
                                ? "#e0e0e0"
                                : "#f5f5f5",
                            padding: 1,
                            borderRadius: 1,
                            maxWidth: "60%",
                          }}
                        />
                      </ListItem>
                    ))
                  ) : (
                    <Box
                      sx={{
                        height: "100%",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography>Tidak ada riwayat pesan</Typography>
                    </Box>
                  )}

                  {filteredChat.length > 0
                    ? filteredChat.map((chatMessage, index) => (
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
                                chatMessage.sender === "admin"
                                  ? "right"
                                  : "left",
                              bgcolor:
                                chatMessage.sender === "admin"
                                  ? "#e0e0e0"
                                  : "#f5f5f5",
                              padding: 1,
                              borderRadius: 1,
                              maxWidth: "60%",
                            }}
                          />
                        </ListItem>
                      ))
                    : null}

                  <div ref={chatEndRef} />
                </List>
              ) : (
                <Box
                  sx={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography>Pilih user untuk memulai pesan</Typography>
                </Box>
              )}
            </Box>

            <Box
              sx={{
                height: "5%",
                mt: 1,
                p: 1,
                display: "flex",
                borderRadius: 1,
                boxShadow: 4,
              }}
            >
              <form
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                }}
                onSubmit={sendMessage}
              >
                <Input
                  sx={{ width: 700 }}
                  placeholder="Tulis pesan disini"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />

                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  startIcon={<SendIcon />}
                >
                  Kirim
                </Button>
              </form>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Fragment>
  );
};

export default ChatPage;
