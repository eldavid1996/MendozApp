import { model, Schema } from "mongoose";

const userRoomSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "user", required: true },
  room: { type: Schema.Types.ObjectId, ref: "room", required: true },
  joinedAt: { type: Date, default: Date.now },
});

userRoomSchema.index({ user: 1, room: 1 }, { unique: true });

export const UserRoom = model("userroom", userRoomSchema);
