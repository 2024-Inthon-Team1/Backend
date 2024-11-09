import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatGateway } from "./chat.gateway";
import { ChatService } from "./chat.service";
import { ChatController } from "./chat.controller";
import { UsersEntity } from "src/entity/users.entity";
import { RoomEntity } from "src/entity/room.entity";
import { ChatEntity } from "src/entity/chat.entity";
import { ChatUserEntity } from "src/entity/chat-user.entity";
import { SocketUserEntity } from "src/entity/socket-user.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsersEntity,
      RoomEntity,
      ChatEntity,
      ChatUserEntity,
      SocketUserEntity,
    ]),
  ],
  providers: [ChatGateway, ChatService],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule {}
