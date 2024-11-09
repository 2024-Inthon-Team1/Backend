import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CommonEntity } from "./common.entity";
import { UsersEntity } from "./users.entity";

@Entity("cassette")
export class CassetteEntity extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar" })
  title: string;

  @Column({ type: "varchar" })
  artist: string;

  @Column({ type: "text" })
  review: string;

  @JoinColumn({ name: "userId" })
  @ManyToOne(() => UsersEntity, (user) => user.cassettes)
  user: UsersEntity;
}
