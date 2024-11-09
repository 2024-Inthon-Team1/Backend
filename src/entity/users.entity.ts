import { Sex } from "src/common/enums/sex.enum";
import { Column, Entity, PrimaryColumn } from "typeorm";
import { CommonEntity } from "./common.entity";

@Entity("users")
export class UsersEntity extends CommonEntity {
  @PrimaryColumn()
  id: string;

  @Column({ nullable: true, type: "enum", enum: Sex })
  sex?: Sex;

  @Column({ nullable: true, type: "varchar" })
  birthday?: string;

  @Column({ nullable: true, type: "varchar", length: 10 })
  username?: string;

  @Column({ nullable: true, type: "varchar" })
  profileUrl?: string;

  @Column({ nullable: true, type: "text" })
  bio?: string;
}
