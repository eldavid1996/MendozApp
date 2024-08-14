import { Socket } from "socket.io";
import { verifyToken } from "../utils";

export const checkJwtSocket = (
  socket: Socket,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  next: (err?: any) => void
) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    const err = new Error("No token provided");
    return next(err);
  }

  try {
    const tokenDecoded = verifyToken(token);

    if (typeof tokenDecoded === "string") {
      const err = new Error("Token invalid");
      return next(err);
    }
    socket.data.decodedToken = tokenDecoded;
  } catch (error) {
    const err = new Error("Authentication error");
    return next(err);
  }
  next();
};
