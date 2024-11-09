import { ApiProperty } from "@nestjs/swagger";
import { UsersEntity } from "src/entity/users.entity";

export class GetRandomUsersSignatureSongResponseDto {
  @ApiProperty({ description: "유저 id" })
  id: string;

  @ApiProperty({ description: "닉네임" })
  username: string;

  @ApiProperty({ description: "대표곡 id" })
  signatureSongId: string;

  @ApiProperty({ description: "대표곡" })
  signatureSong: string;

  @ApiProperty({ description: "대표곡 아티스트" })
  signatureSongArtist: string;

  constructor(user: UsersEntity) {
    this.id = user.id;
    this.username = user.username;
    this.signatureSongId = user.signatureSongId;
    this.signatureSong = user.signatureSong;
    this.signatureSongArtist = user.signatureSongArtist;
  }
}
