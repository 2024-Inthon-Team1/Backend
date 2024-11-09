import {
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CommonEntity } from "./common.entity";
import { ChatEntity } from "./chat.entity";

@Entity("room")
export class RoomEntity extends CommonEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  invitor: string;

  @Column()
  invitee: string;

  @OneToMany(() => ChatEntity, (chat) => chat.room)
  chats: ChatEntity[];

  @OneToMany(() => ChatEntity, (chat) => chat.room)
  socket: ChatEntity[];
}
