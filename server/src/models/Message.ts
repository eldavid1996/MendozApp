import { model, Schema } from "mongoose";

const messageSchema = new Schema({
  room: { type: Schema.Types.ObjectId, ref: "room", required: true },
  user: { type: Schema.Types.ObjectId, ref: "user", required: true },
  messageText: { type: String, required: true },
  sentAt: { type: Date, default: Date.now },
});

export const Message = model("message", messageSchema);
