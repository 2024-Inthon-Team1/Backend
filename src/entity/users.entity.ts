import { Sex } from "src/common/enums/sex.enum";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { CommonEntity } from "./common.entity";
import { CassetteEntity } from "./cassette.entity";

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

  @Column({ nullable: true, type: "varchar" })
  signatureSong?: string;

  @Column({ nullable: true, type: "varchar" })
  signatureSongArtist?: string;

  @OneToMany(() => CassetteEntity, (cassette) => cassette.user)
  cassettes: CassetteEntity[];
}
