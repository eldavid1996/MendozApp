import { connect } from "mongoose";
import { MONGO_URI } from ".";
import { createRoomMongo } from "../services";

export const connectMongo = async () => {
  try {
    await connect(MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(`Error connecting to MongoDB in ${MONGO_URI} :`, error);
    process.exit(1);
  }
};

export const executeMigrations = async () => {
  try {
    await createRoomMongo("General", "General");
    console.log("Documents migrations done");
  } catch (error) {
    console.error(`Error migrating documents :`, error);
    process.exit(1);
  }
};
