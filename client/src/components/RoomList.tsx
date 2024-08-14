import {
  Listbox,
  ListboxItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import { LoginIcon, PlusIcon, TrashIcon, UserIcon } from "./Icons";
import { useState } from "react";
import SocketService from "../services/chat";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import AddFriendToRoom from "./AddFriendRoom";

export default function RoomList({
  username,
  rooms,
  actualRoom,
  roomsWithMessages,
  setRoomsWithMessages,
}: {
  username: string;
  rooms: { roomName: string; roomMaster: string }[];
  actualRoom: string;
  roomsWithMessages: { roomName: string; count: number }[];
  setRoomsWithMessages: (rooms: { roomName: string; count: number }[]) => void;
}) {
  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const {
    isOpen: isUserOpen,
    onOpen: onUserOpen,
    onClose: onUserClose,
  } = useDisclosure();

  const [roomToDelete, setRoomToDelete] = useState<string>("");
  const [roomToInvite, setRoomToInvite] = useState<string>("");
  const [newRoomName, setNewRoomName] = useState("");
  const [userToInvite, setUserToInvite] = useState("");

  const openDeleteModal = (room: string) => {
    setRoomToDelete(room);
    onDeleteOpen();
  };

  const openInviteFriendsModal = (room: string) => {
    setRoomToInvite(room);
    onUserOpen();
  };

  const handleCreateRoom = () => {
    if (newRoomName === "") return;
    SocketService.createNewRoom(newRoomName);
    setNewRoomName("");
    onCreateClose();
  };

  const handleDeleteRoom = () => {
    SocketService.onDeleteRoom(roomToDelete);
    setRoomToDelete("");
    onDeleteClose();
  };

  const handleJoinRoom = (room: string) => {
    SocketService.joinRoom(room);
    setRoomsWithMessages(roomsWithMessages.filter((r) => r.roomName != room));
  };

  const handleInviteUser = () => {
    SocketService.inviteUserToRoom(userToInvite, roomToInvite);
    setUserToInvite("");
    setRoomToInvite("");
    onUserClose();
  };

  return (
    <>
      <p className="text-2xl font-bold p-3">Salas</p>
      <Listbox aria-label="Rooms">
        {rooms.map((room) => (
          <ListboxItem
            textValue={room.roomName}
            className={
              room.roomName == actualRoom ? "bg-blue-400 text-white" : ""
            }
            key={room.roomName}
            endContent={
              <div className="flex gap-3">
                {room.roomName != actualRoom ? (
                  <button
                    title="Entrar"
                    onClick={() => handleJoinRoom(room.roomName)}
                  >
                    <LoginIcon className="h-5 w-5 text-blue-500" />
                  </button>
                ) : null}
                {roomsWithMessages.filter((r) => r.roomName == room.roomName)
                  .length > 0 ? (
                  <span className="text-xs text-red-500 font-bold">
                    {
                      roomsWithMessages.filter(
                        (r) => r.roomName == room.roomName
                      ).length
                    }
                  </span>
                ) : null}
                {room.roomMaster == username ? (
                  <UserIcon
                    className={
                      room.roomName == actualRoom
                        ? " text-white"
                        : "text-blue-500 "
                    }
                    onClick={() => openInviteFriendsModal(room.roomName)}
                  />
                ) : null}
                {room.roomMaster == username && room.roomName != actualRoom ? (
                  <button
                    title="Eliminar"
                    onClick={() => openDeleteModal(room.roomName)}
                  >
                    <TrashIcon className="h-5 w-5 text-red-500" />
                  </button>
                ) : null}
              </div>
            }
          >
            {room.roomName} - <span className="text-xs">{room.roomMaster}</span>
          </ListboxItem>
        ))}
      </Listbox>
      <div className="flex justify-center mt-2 p-2">
        <button
          onClick={onCreateOpen}
          className="p-1 bg-blue-50 rounded-lg hover:bg-blue-100 flex flex-col items-center"
        >
          <PlusIcon className="h-6 w-6 md:h-8 md:w-8 text-black mb-1" />
          <span>Crear nueva sala</span>
        </button>
        <Modal
          isOpen={isCreateOpen}
          onOpenChange={onCreateClose}
          placement="top-center"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>Crear nueva sala</ModalHeader>
                <ModalBody>
                  <Input
                    autoFocus
                    label="Nombre"
                    placeholder="Nombre de la sala"
                    variant="bordered"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCreateRoom();
                    }}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Cerrar
                  </Button>
                  <Button color="primary" onPress={handleCreateRoom}>
                    Crear
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
        <ConfirmDeleteModal
          isOpen={isDeleteOpen}
          onOpenChange={onDeleteClose}
          onDelete={handleDeleteRoom}
          roomToDelete={roomToDelete}
        />
        <AddFriendToRoom
          isOpen={isUserOpen}
          onOpenChange={onUserClose}
          onDelete={handleInviteUser}
          roomToInvite={roomToInvite}
          userToInvite={userToInvite}
          setUserToInvite={setUserToInvite}
        />
      </div>
    </>
  );
}
