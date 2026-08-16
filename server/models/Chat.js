import { Schema, model } from "mongoose";

const chatSchema = new Schema({
  message: { type: String },
  sender: { type: String },
  recipient: { type: String },
  isAutoReply: { type: Boolean, default: false },
});

export default model("chat", chatSchema);
