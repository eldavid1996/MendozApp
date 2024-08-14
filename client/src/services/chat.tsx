import { io, Socket } from "socket.io-client";
import { getToken } from "../utils/token";
import { ChatMessage, UserInfo } from "../interfaces";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

class SocketService {
  private socket: Socket | null = null;

  async connect(): Promise<Socket> {
    const token = getToken();
    if (!token) {
      throw new Error("No token found");
    }

    this.socket = io(API_BASE_URL, {
      auth: { token },
    });

    return new Promise((resolve, reject) => {
      if (this.socket) {
        this.socket.on("connect", () => {
          resolve(this.socket as Socket);
        });

        this.socket.on("connect_error", () => {
          reject(new Error("Connection error"));
        });
      } else {
        reject(new Error("Socket initialization error"));
      }
    });
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }

  onUserConnected(callback: (userInfo: UserInfo) => void) {
    this.socket?.on("user connected", callback);
  }

  onOldChatMessages(callback: (msg: ChatMessage[]) => void) {
    this.socket?.on("old chat messages", callback);
  }

  onRoomsGranted(
    callback: (
      rooms: {
        roomName: string;
        roomMaster: string;
      }[]
    ) => void
  ) {
    this.socket?.on("rooms granted", callback);
  }

  onNewRoomGranted(
    callback: (newRoom: { roomName: string; roomMaster: string }) => void
  ) {
    this.socket?.on("new room granted", callback);
  }

  onDeleteRoom(roomName: string) {
    this.socket?.emit("delete room", roomName);
  }

  onRoomDeleted(callback: (roomDeleted: string) => void) {
    this.socket?.on("room deleted", callback);
  }

  onChatMessage(callback: (msg: ChatMessage) => void) {
    this.socket?.on("chat message", callback);
  }
  offChatMessage(callback: (msg: ChatMessage) => void) {
    this.socket?.off("chat message", callback);
  }
  sendChatMessage(message: string) {
    this.socket?.emit("chat message", message);
  }

  createNewRoom(roomName: string) {
    this.socket?.emit("create room", roomName);
  }

  inviteUserToRoom(user: string, roomName: string) {
    this.socket?.emit("invite user to room", user, roomName);
  }
  getUsersInRoom(roomName: string) {
    this.socket?.emit("get users in room", roomName);
  }
  onGetUsersInRoom(callback: (users: string[]) => void) {
    this.socket?.on("users in room", callback);
  }

  joinRoom(roomName: string) {
    this.socket?.emit("join room", roomName);
  }

  onRoomJoined(callback: (room: string, messages: ChatMessage[]) => void) {
    this.socket?.on("room joined", callback);
  }
  offRoomJoined(callback: (roomName: string, messages: ChatMessage[]) => void) {
    this.socket?.off("room joined", callback);
  }
}

export default new SocketService();
