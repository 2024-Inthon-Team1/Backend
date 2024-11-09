import { ApiProperty } from "@nestjs/swagger";

export class CreateCassetteResponseDto {
  @ApiProperty({ description: "성공 여부" })
  saved: boolean;

  constructor(saved: boolean) {
    this.saved = saved;
  }
}
