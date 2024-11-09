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

  @Column()
  title: string;

  @Column()
  type: string;

  @Column()
  artist: string;

  @JoinColumn({ name: "userId" })
  @ManyToOne(() => UsersEntity, (user) => user.cassettes)
  user: UsersEntity;
}
