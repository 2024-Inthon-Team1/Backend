import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CommonEntity } from "./common.entity";
import { RoomEntity } from "./room.entity";
import { ChatUserEntity } from "./chat-user.entity";

@Entity("chat")
export class ChatEntity extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn({ name: "roomId" })
  @ManyToOne(() => RoomEntity, (room) => room.chats)
  room: RoomEntity;

  @JoinColumn({ name: "chatUserId" })
  @ManyToOne(() => ChatUserEntity, (cuser) => cuser.chats)
  chatUser: ChatUserEntity;

  @Column()
  message: string;
}
