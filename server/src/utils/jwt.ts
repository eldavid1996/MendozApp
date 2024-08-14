import { sign, verify } from "jsonwebtoken";
import { JWT_SECRET } from "../config";

export const generateToken = async (email: string) => {
  const jwt = sign({ email }, JWT_SECRET, {
    expiresIn: "1d",
  });
  return jwt;
};

export const verifyToken = (token: string) => {
  return verify(token, JWT_SECRET);
};
