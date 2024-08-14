import { model, Schema } from "mongoose";

const roomSchema = new Schema({
  roomName: { type: String, required: true, unique: true },
  roomMaster: { type: String, required: true, unique: false },
  createdAt: { type: Date, default: Date.now },
});

export const Room = model("room", roomSchema);
