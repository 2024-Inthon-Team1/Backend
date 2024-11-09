import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CommonEntity } from "./common.entity";
import { ChatEntity } from "./chat.entity";

@Entity("chat_user")
export class ChatUserEntity extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  username: string;

  @Column()
  profileUrl: string;

  @Column()
  roomId: string;

  @OneToMany(() => ChatEntity, (chat) => chat.chatUser)
  chats: ChatEntity[];
}
