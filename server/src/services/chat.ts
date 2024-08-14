import { Message, Room, User, UserRoom } from "../models";

// Create
export const createRoomMongo = async (roomName: string, roomMaster: string) => {
  const existingRoom = await Room.findOne({ roomName });
  if (existingRoom) return "Room already exists";

  await Room.create({
    roomName: roomName,
    roomMaster: roomMaster,
  });

  return "Success";
};

export const deleteRoomMongo = async (roomName: string, userEmail: string) => {
  const existingRoom = await Room.findOne({ roomName });
  const existingUser = await User.findOne({ email: userEmail });
  if (!existingRoom) return "Room not exists";
  if (!existingUser) return "User not exists";

  await UserRoom.deleteMany({
    room: existingRoom._id,
  });
  await Room.deleteOne({
    roomName: roomName,
  });
  await Message.deleteMany({
    room: existingRoom._id,
  });

  return "Success";
};

export const createMessageMongo = async (
  msg: string,
  email: string,
  roomName: string
) => {
  const user = await getUserByEmailMongo(email);
  const room = await getRoomByNameMongo(roomName);
  if (!user || !room) return "User or Room not found";
  await Message.create({
    messageText: msg,
    user: user._id,
    room: room._id,
  });
  return "Success";
};

// Search
export const getAllRoomMessagesIfUserEmailGrantedMongo = async (
  email: string,
  roomName: string
) => {
  const userRoom = await checkUserRoomGrantedMongo(email, roomName);
  if (!userRoom) return null;

  const room = await getRoomByNameMongo(roomName);
  if (!room) return null;

  const messages = await Message.find({
    room: room._id,
  });
  if (!messages) return null;

  const messagesWithUserInfo = await Promise.all(
    messages.map(async (message) => {
      const user = await User.findById(message.user._id);
      if (!user) return null;
      return {
        messageText: message.messageText,
        username: user.username,
      };
    })
  );

  return messagesWithUserInfo;
};

export const checkUserRoomGrantedMongo = async (
  email: string,
  roomName: string
) => {
  const user = await getUserByEmailMongo(email);
  const room = await getRoomByNameMongo(roomName);
  if (!user || !room) return null;

  const userRoom = await UserRoom.findOne({
    user: user._id,
    room: room._id,
  });
  if (!userRoom) return null;
  return userRoom;
};

export const getRoomNamesGrantedByUserEmailMongo = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) return null;

  const userRoom = await UserRoom.find({ user: user._id });
  if (userRoom.length === 0) return null;

  const roomIds: string[] = [];
  userRoom.forEach((userRoom) => {
    roomIds.push(userRoom.room._id.toString());
  });
  if (roomIds.length === 0) return null;

  const roomsData = await Promise.all(
    roomIds.map(async (id) => {
      const room = await Room.findById(id);
      return {
        roomName: room ? room.roomName : null,
        roomMaster: room ? room.roomMaster : null,
      };
    })
  );
  return roomsData.filter(
    (roomData) => roomData.roomName !== null && roomData.roomMaster !== null
  );
};

export const getUsersGrantedByRoomName = async (roomname: string) => {
  const room = await Room.findOne({ roomName: roomname });
  if (!room) return null;
  const usersGranted = await UserRoom.find({ room: room._id });
  if (!usersGranted) return null;

  const usersGrantedIds: string[] = [];
  usersGranted.forEach((userRoom) => {
    usersGrantedIds.push(userRoom.user._id.toString());
  });
  if (usersGrantedIds.length === 0) return null;

  const usersData = await Promise.all(
    usersGrantedIds.map(async (userId) => {
      const userInfo = await User.findOne({ _id: userId });
      return userInfo ? userInfo.username : null;
    })
  );
  return usersData;
};

export const getUserByEmailMongo = async (email: string) => {
  const user = await User.findOne({ email: email });
  if (!user) return null;
  return user;
};

export const getUserByUsernameMongo = async (username: string) => {
  const user = await User.findOne({ username: username });
  if (!user) return null;
  return user;
};

export const getRoomByNameMongo = async (roomName: string) => {
  const room = await Room.findOne({ roomName });
  if (!room) return null;
  return room;
};
