import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class AddProfileImageDto {
  @ApiProperty({
    type: "string",
    format: "binary",
    description: "프로필 사진",
  })
  @IsOptional()
  profileImage: any;
}
