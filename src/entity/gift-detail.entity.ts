import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CommonEntity } from "./common.entity";
import { GiftEntity } from "./gift.entity";

@Entity("gift_detail")
export class GiftDetailEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar" })
  songId: string;

  @Column({ type: "varchar" })
  title: string;

  @Column({ type: "varchar" })
  artist: string;

  @JoinColumn({ name: "giftId" })
  @ManyToOne(() => GiftEntity, (gift) => gift.giftDetails)
  gift: GiftEntity;
}
