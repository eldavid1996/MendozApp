import { config } from "dotenv";
config();

export const PORT = process.env.PORT || 3000;

export const GRANTED_HOSTS = process.env.GRANTED_HOSTS || "*";

export const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/chat";

export const JWT_SECRET = process.env.JWT_SECRET || "StrongPassword1!";
