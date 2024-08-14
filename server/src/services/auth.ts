import { User, UserRoom } from "../models";
import { encrypt, verified } from "../utils";
import { getRoomByNameMongo, getUserByEmailMongo } from "./chat";

export const registerUserMongo = async (
  username: string,
  email: string,
  password: string
) => {
  const existingUserEmail = await User.findOne({ email });
  if (existingUserEmail) return "Ese email ya esta en uso";

  const existingUsername = await User.findOne({ username });
  if (existingUsername) return "Ese nombre de usuario ya esta en uso";

  const hashedPassword = await encrypt(password);

  const registeredUser = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  const granted = await grantUserRoomMongo(registeredUser.email, "General");
  if (!granted) return "Error granting permissions for enter into General room";

  return "Success";
};

export const loginUserMongo = async (email: string, password: string) => {
  const existingUser = await User.findOne({ email });
  if (!existingUser) return "Ese email no existe";

  const isCorrect = await verified(password, existingUser.password);
  if (!isCorrect) return "Contrasena incorrecta";

  return "Success";
};

export const grantUserRoomMongo = async (email: string, roomName: string) => {
  const user = await getUserByEmailMongo(email);
  const room = await getRoomByNameMongo(roomName);
  if (!user || !room) return null;
  const userRoomGranted = await UserRoom.create({
    user: user._id,
    room: room._id,
  });

  return userRoomGranted;
};
