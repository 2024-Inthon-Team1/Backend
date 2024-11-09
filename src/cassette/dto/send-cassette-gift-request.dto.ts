import { ApiProperty } from "@nestjs/swagger";
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
} from "class-validator";

export class SendCassetteGiftRequestDto {
  @ApiProperty({ description: "보낼 사람 id" })
  @IsNotEmpty()
  @IsString()
  receiverId: string;

  @ApiProperty({ description: "카세트 id 리스트" })
  @IsArray()
  @ArrayMinSize(1, {
    message: "카세트 ID 리스트는 최소 1개 이상이어야 합니다.",
  })
  @ArrayMaxSize(5, { message: "카세트 ID 리스트는 최대 5개까지 가능합니다." })
  cassetteIds: number[];

  @ApiProperty({ description: "편지" })
  @IsNotEmpty()
  @IsString()
  letter: string;
}
