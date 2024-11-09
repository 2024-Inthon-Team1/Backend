import { ApiProperty } from "@nestjs/swagger";

export class KakaoLoginResponseDto {
  @ApiProperty({ description: "access token" })
  accessToken: string;

  @ApiProperty({ description: "refresh token" })
  refreshToken: string;

  @ApiProperty({ description: "user id" })
  userId: string;

  constructor(accessToken: string, refreshToken: string, userId: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.userId = userId;
  }
}
