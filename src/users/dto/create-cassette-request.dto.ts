import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateCassettesRequestDto {
  @ApiProperty({ description: "노래 id" })
  @IsString()
  @IsNotEmpty()
  songId: string;

  @ApiProperty({ description: "노래 제목" })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: "아티스트명" })
  @IsString()
  @IsNotEmpty()
  artist: string;

  @ApiProperty({ description: "한줄평" })
  @IsString()
  @IsNotEmpty()
  review: string;
}
