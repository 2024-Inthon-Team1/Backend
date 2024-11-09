import { ApiProperty } from "@nestjs/swagger";

export class KakaoLoginResponseDto {
  @ApiProperty({ description: "access token" })
  accessToken: string;

  @ApiProperty({ description: "refresh token" })
  refreshToken: string;

  @ApiProperty({ description: "user id" })
  userId: string;

  @ApiProperty({ description: "이미 회원가입 한 유저인지 확인하는 값" })
  isSignedup: boolean;

  constructor(
    accessToken: string,
    refreshToken: string,
    userId: string,
    isSignedUp: boolean
  ) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.userId = userId;
    this.isSignedup = isSignedUp;
  }
}
