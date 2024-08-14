import cors from "cors";
import { GRANTED_HOSTS } from "./environment";

export const corsOptions = {
  origin: GRANTED_HOSTS,
  methods: ["GET", "POST"],
  credentials: true,
};

export const configureCors = cors(corsOptions);
