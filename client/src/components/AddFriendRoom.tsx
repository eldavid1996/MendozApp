import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import SocketService from "../services/chat";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onDelete: () => void;
  roomToInvite: string;
  userToInvite: string;
  setUserToInvite: (userToInvite: string) => void;
}
const AddFriendToRoom: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onOpenChange,
  onDelete,
  roomToInvite,
  userToInvite,
  setUserToInvite,
}) => {
  const [friendsInRoom, setFriensdInRoom] = useState<string[]>([]);

  useEffect(() => {
    SocketService.getUsersInRoom(roomToInvite);
  }, [roomToInvite]);

  useEffect(() => {
    SocketService.onGetUsersInRoom(setFriensdInRoom);
  }, [roomToInvite]);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Añadir amigos a la sala {roomToInvite}</ModalHeader>
            <ModalBody>
              <p>Usuarios actuales:</p>
              {friendsInRoom &&
                friendsInRoom.map((username) => (
                  <p className="text-blue-500 text-sm ml-2 mb-2" key={username}>
                    {username}
                  </p>
                ))}
              <input
                autoFocus
                type="text"
                value={userToInvite}
                onChange={(e) => setUserToInvite(e.target.value)}
                placeholder="Nombre de usuario"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Cerrar
              </Button>
              <Button color="primary" onPress={onDelete}>
                Añadir
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default AddFriendToRoom;
