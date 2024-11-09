import { ApiProperty } from "@nestjs/swagger";
import { Sex } from "src/common/enums/sex.enum";
import { UsersEntity } from "src/entity/users.entity";

export class GetProfileResponseDto {
  @ApiProperty()
  sex: Sex;

  @ApiProperty()
  birthDaty: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  profileUrl: string;

  @ApiProperty()
  sinatureSongId: string;

  @ApiProperty()
  signatureSong: string;

  @ApiProperty()
  signatureSongArtist: string;

  constructor(user: UsersEntity, profileUrl: string) {
    this.sex = user.sex;
    this.birthDaty = user.birthday;
    this.username = user.username;
    this.profileUrl = profileUrl;
    this.sinatureSongId = user.signatureSongId;
    this.signatureSong = user.signatureSong;
    this.signatureSongArtist = user.signatureSongArtist;
  }
}
