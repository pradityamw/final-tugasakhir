import { Schema, model } from "mongoose";

const chatSchema = new Schema({
  message: { type: String },
  sender: { type: String },
  recipient: { type: String },
});

export default model("chat", chatSchema);
