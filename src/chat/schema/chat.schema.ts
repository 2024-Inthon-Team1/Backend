// chat.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ collection: "chats", timestamps: true })
export class Chat extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: "Room" })
  roomId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: "User" })
  senderId: Types.ObjectId;

  @Prop({ required: true })
  message: string;

  @Prop({ default: Date.now() })
  createdAt: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
