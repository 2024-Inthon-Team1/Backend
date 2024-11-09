import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CommonEntity } from "./common.entity";
import { GiftDetailEntity } from "./gift-detail.entity";

@Entity("gift")
export class GiftEntity extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar" })
  senderId: string;

  @Column({ type: "varchar" })
  receiverId: string;

  @Column({ type: "text" })
  letter: string;

  @OneToMany(() => GiftDetailEntity, (giftDetail) => giftDetail.gift)
  giftDetails: GiftDetailEntity[];
}
