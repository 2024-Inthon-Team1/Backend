// user.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ collection: "users" })
export class User extends Document {
  @Prop({ required: true, unique: true })
  userId: string; // 고유 사용자 ID

  @Prop({ required: true })
  username: string; // 사용자 이름

  @Prop({ required: true, unique: true })
  profileUrl: string; // 사용자 이메일

  @Prop({ types: [Types.ObjectId], ref: "Room" })
  chats: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
