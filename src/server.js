import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = createServer(app);
const port = process.env.PORT || 4000;

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: [
      "https://d9c.github.io/livechat-frontend",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User ${socket.id} joined room ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected`);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
