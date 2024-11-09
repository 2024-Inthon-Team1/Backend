// room.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ collection: "rooms" })
export class Room extends Document {
  @Prop({ required: true, unique: true })
  roomId: string;

  @Prop({ default: null })
  name: string;

  @Prop({ required: true, type: [Types.ObjectId], ref: "User" })
  invitor: Types.ObjectId; // 방 만든 사람, 즉 선물 받은 사람

  @Prop({ required: true, type: [Types.ObjectId], ref: "User" })
  invitee: Types.ObjectId; // 초대 받은 사람, 즉 선물 준 사람

  @Prop({ default: new Date() })
  createdAt: Date;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
