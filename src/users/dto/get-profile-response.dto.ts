import { ApiProperty } from "@nestjs/swagger";
import { Sex } from "src/common/enums/sex.enum";
import { UsersEntity } from "src/entity/users.entity";

export class GetProfileResponseDto {
  @ApiProperty()
  sex: Sex;

  @ApiProperty()
  birthDay: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  sinatureSongId: string;

  @ApiProperty()
  signatureSong: string;

  @ApiProperty()
  signatureSongArtist: string;

  constructor(user: UsersEntity) {
    this.sex = user.sex;
    this.birthDay = user.birthday;
    this.username = user.username;
    this.sinatureSongId = user.signatureSongId;
    this.signatureSong = user.signatureSong;
    this.signatureSongArtist = user.signatureSongArtist;
  }
}
