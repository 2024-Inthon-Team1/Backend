import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UsersEntity } from "./users.entity";
import { RoomEntity } from "./room.entity";

@Entity("socket_user")
export class SocketUserEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  socketId: string; // WebSocket 클라이언트 ID

  @ManyToOne(() => UsersEntity, (user) => user.socketUsers, {
    onDelete: "CASCADE",
  })
  user: UsersEntity;

  @ManyToOne(() => RoomEntity, (room) => room.socketUsers, {
    onDelete: "CASCADE",
    nullable: true,
  })
  room: RoomEntity; // 연결된 방 (선택적)

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  connectedAt: Date; // 연결 시간

  @Column({ type: "timestamp", nullable: true })
  disconnectedAt: Date | null; // 연결이 끊긴 시간
}
