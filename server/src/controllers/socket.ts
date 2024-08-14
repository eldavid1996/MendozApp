import { Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import { corsOptions } from "../config";
import { checkJwtSocket } from "../middlewares";
import {
  checkUserRoomGrantedMongo,
  createMessageMongo,
  createRoomMongo,
  deleteRoomMongo,
  getAllRoomMessagesIfUserEmailGrantedMongo,
  getRoomNamesGrantedByUserEmailMongo,
  getUserByEmailMongo,
  getUserByUsernameMongo,
  getUsersGrantedByRoomName,
  grantUserRoomMongo,
} from "../services";

export const socketManager = (server: Server) => {
  // Cors
  const io = new SocketIOServer(server, {
    cors: corsOptions,
  });

  // Middleware for authentication
  io.use(checkJwtSocket);

  io.on("connection", async (socket) => {
    // Initialization do some checks and get some data
    let roomName = "General";
    const userEmail = socket.data.decodedToken.email;
    if (!userEmail) {
      console.log(`Token not found`);
      socket.disconnect();
      return;
    }
    const user = await getUserByEmailMongo(userEmail);
    if (!user) {
      console.log(`User not found: ${userEmail}`);
      socket.disconnect();
      return;
    }

    // Connection to the initial room and emit user info
    socket.join(roomName);
    console.log(`User ${socket.id} ${userEmail} connected to ${roomName}`);
    const userInfo = {
      username: user.username,
      email: user.email,
    };
    socket.emit("user connected", userInfo);

    // Emit old messages
    const oldMessages = await getAllRoomMessagesIfUserEmailGrantedMongo(
      userEmail,
      roomName
    );
    socket.emit("old chat messages", oldMessages);

    // Emit rooms names granted
    const roomsGranted = await getRoomNamesGrantedByUserEmailMongo(userEmail);
    socket.emit("rooms granted", roomsGranted);

    // On chat message
    socket.on("chat message", async (msg: string) => {
      await createMessageMongo(msg, userEmail, roomName);
      io.to(roomName).emit("chat message", {
        username: user.username,
        messageText: msg,
        roomName: roomName,
      });
    });

    socket.on("get users in room", async (roomname: string) => {
      const usernames = await getUsersGrantedByRoomName(roomname);
      io.to(roomName).emit("users in room", usernames);
    });

    socket.on("invite user to room", async (user: string, roomname: string) => {
      const userData = await getUserByUsernameMongo(user);
      if (!userData) return;
      const grantedYet = await checkUserRoomGrantedMongo(
        userData.email,
        roomname
      );
      if (grantedYet) return;
      await grantUserRoomMongo(userData?.email, roomname);
    });

    socket.on("delete room", async (roomName: string) => {
      const result = await deleteRoomMongo(roomName, userEmail);
      if (result === "Success") {
        socket.emit("room deleted", roomName);
      }
    });

    // On create room
    socket.on("create room", async (newRoomName: string) => {
      const result = await createRoomMongo(newRoomName, user.username);
      if (result === "Success") {
        await grantUserRoomMongo(userEmail, newRoomName);
        socket.emit("new room granted", {
          roomName: newRoomName,
          roomMaster: user.username,
        });
      }
    });

    // On join room
    socket.on("join room", async (roomname: string) => {
      const result = await checkUserRoomGrantedMongo(userEmail, roomname);
      const messages = await getAllRoomMessagesIfUserEmailGrantedMongo(
        userEmail,
        roomname
      );
      if (result) {
        socket.join(roomname);
        socket.emit("room joined", roomname, messages);
      }
      roomName = roomname;
    });

    socket.on("disconnect", () => {
      console.log(
        `User ${socket.id} ${userEmail} disconnected from ${roomName}`
      );
    });
  });

  return io;
};
