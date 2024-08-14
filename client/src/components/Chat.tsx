import { useState, useEffect, useRef } from "react";
import { Button, Textarea } from "@nextui-org/react";
import { Link } from "react-router-dom";
import RoomList from "./RoomList";
import SocketService from "../services/chat";
import { ContainerInsideChat, ContainerOutside } from "./Shared/Container";
import {
  LeftArrowIcon,
  LogoutIcon,
  MessageIcon,
  RightArrowIcon,
} from "./Icons";
import { ChatMessage, CustomMessage, UserInfo } from "../interfaces";

export default function Chat() {
  const [customMessage, setCustomMessage] = useState<CustomMessage>({
    type: "error",
    text: " ",
  });
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [actualRoom, setActualRoom] = useState("General");
  const [username, setUsername] = useState("");
  const [rooms, setRooms] = useState<
    { roomName: string; roomMaster: string }[]
  >([]);
  const [roomsWithMessages, setRoomsWithMessages] = useState<
    { roomName: string; count: number }[]
  >([{ roomName: "", count: 0 }]);
  const [showMenu, setShowMenu] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "Chat";
    const initSocket = async () => {
      try {
        setCustomMessage({ type: "success", text: "● Conectado" });
        await SocketService.connect();
      } catch (error) {
        setCustomMessage({ type: "error", text: "● Error de conexión" });
      }
    };
    initSocket();

    return () => {
      SocketService.disconnect();
    };
  }, []);

  useEffect(() => {
    SocketService.onUserConnected((user: UserInfo) => {
      setUsername(user.username);
    });
  }, []);

  useEffect(() => {
    SocketService.onOldChatMessages((msgs: ChatMessage[]) => {
      setMessages(msgs);
    });
  }, []);

  useEffect(() => {
    SocketService.onRoomsGranted(
      (
        rooms: {
          roomName: string;
          roomMaster: string;
        }[]
      ) => {
        setRooms(rooms);
      }
    );
  }, []);

  useEffect(() => {
    SocketService.onNewRoomGranted(
      (newRoom: { roomName: string; roomMaster: string }) => {
        setRooms((roomNames) => [...roomNames, newRoom]);
      }
    );
  }, []);

  useEffect(() => {
    SocketService.onRoomDeleted((roomName: string) => {
      setRooms((rooms) => rooms.filter((room) => room.roomName !== roomName));
    });
  }, []);

  useEffect(() => {
    const handleRoomJoined = (roomName: string, messages: ChatMessage[]) => {
      setActualRoom(roomName);
      setMessages(messages);
    };

    SocketService.onRoomJoined(handleRoomJoined);

    return () => {
      SocketService.offRoomJoined(handleRoomJoined);
    };
  }, []);

  useEffect(() => {
    const handleChatMessage = (msg: ChatMessage) => {
      if (msg.roomName === actualRoom) {
        setMessages((prevMessages) => [...prevMessages, msg]);
      } else {
        setRoomsWithMessages((prevMessages) => [
          ...prevMessages,
          {
            roomName: msg.roomName,
            count: roomsWithMessages[roomsWithMessages.length - 1].count + 1,
          },
        ]);
      }
    };

    SocketService.onChatMessage(handleChatMessage);

    return () => {
      SocketService.offChatMessage(handleChatMessage);
    };
  }, [actualRoom, roomsWithMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (event: React.FormEvent) => {
    event.preventDefault();

    if (message.trim()) {
      SocketService.sendChatMessage(message);
      setMessage("");
    }
  };

  return (
    <ContainerOutside>
      <ContainerInsideChat>
        <div className="flex justify-between">
          <div className="mt-1 text-lg">
            {customMessage?.text && customMessage.type === "error" ? (
              <p className="text-red-500">{customMessage.text}</p>
            ) : customMessage?.text && customMessage.type === "success" ? (
              <p className="text-green-500">{customMessage.text}</p>
            ) : null}
          </div>
          <Button
            as={Link}
            to="/"
            color="danger"
            className="mb-4 p-2"
            onClick={() => {
              localStorage.removeItem("token");
            }}
          >
            Desconectar
            <LogoutIcon width={25} height={25} />
          </Button>
        </div>
        {!username ? (
          <p className="text-center text-gray-500">Cargando mensajes...</p>
        ) : (
          <div className="flex-grow overflow-y-scroll border border-gray-300 p-2 rounded-lg shadow-inner">
            <p className="text-center text-gray-500 border-b border-gray-300 p-2">
              {actualRoom}
            </p>
            {messages.length === 0 ? (
              <p className="text-center text-gray-500 text-tiny p-2">
                No hay mensajes
              </p>
            ) : null}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex mb-2 mt-2 ${
                  username === msg.username ? "justify-end" : "justify-start"
                }`}
              >
                <p
                  className={`text-sm break-words whitespace-normal p-2 rounded-lg max-w-xs md:max-w-md ${
                    username === msg.username
                      ? "bg-green-200 text-gray-700 rounded-br-none"
                      : "bg-white text-gray-700 rounded-bl-none border"
                  }`}
                >
                  <strong>{msg.username}</strong>: {msg.messageText}
                </p>
                <div ref={messagesEndRef} />
              </div>
            ))}
          </div>
        )}
        <form className="flex gap-2 items-start" onSubmit={handleSend}>
          <Textarea
            minRows={1}
            className="flex-grow mt-2"
            placeholder="Mensaje"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend(e)}
          />
          <Button
            type="submit"
            className="w-32 self-end p-2 text-white bg-green-400 rounded-lg hover:bg-green-600"
            isLoading={customMessage?.type === "error"}
          >
            Enviar <MessageIcon width={25} height={25} />
          </Button>
        </form>

        <div
          className={`fixed top-0 right-0 h-full ${
            showMenu ? "w-1/2 md:w-1/6" : "w-0"
          } p-1 md:p-1 bg-white shadow-lg transition-all duration-300  `}
        >
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="absolute left-[-13px] md:left-[-28px] top-1/2 transform -translate-y-1/2 w-7 h-7 md:w-10 md:h-10 flex items-center justify-center  rounded-full bg-blue-500 hover:bg-blue-600"
          >
            {showMenu ? (
              <RightArrowIcon className="h-4 w-4 md:h-6 md:w-6 text-white" />
            ) : (
              <LeftArrowIcon className="h-4 w-4 md:h-6 md:w-6 text-white" />
            )}
          </button>

          <div className="overflow-y-scroll h-full">
            <RoomList
              rooms={rooms}
              actualRoom={actualRoom}
              username={username}
              roomsWithMessages={roomsWithMessages}
              setRoomsWithMessages={setRoomsWithMessages}
            />
          </div>
        </div>
      </ContainerInsideChat>
    </ContainerOutside>
  );
}
