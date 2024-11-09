import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schema/user.schema";
import { Room, RoomSchema } from "./schema/room.schema";
import { Chat, ChatSchema } from "./schema/chat.schema";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatGateway } from "./chat.gateway";
import { ChatService } from "./chat.service";
import { ChatController } from "./chat.controller";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chat.name, schema: ChatSchema },
      { name: Room.name, schema: RoomSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [ChatGateway, ChatService],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule {}
