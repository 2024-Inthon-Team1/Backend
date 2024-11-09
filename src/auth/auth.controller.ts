import {
  Body,
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UsersService } from "src/users/users.service";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";
import { KakaoLoginRequestDto } from "./dto/kakao-login-request.dto";
import { AuthGuard } from "@nestjs/passport";
import { AccessUser } from "src/common/decorators/accessUser.decorator";
import {
  JwtPayload,
  RefreshTokenPayload,
} from "src/common/interface/auth.interface";
import { SignUpRequestDto } from "./dto/sign-up-request.dto";
import { TokenResponseDto } from "./dto/token-response-dto";
import { RefreshUser } from "src/common/decorators/refreshUser.decorator";
import { KakaoLoginResponseDto } from "./dto/kakao-login-response.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  @ApiOperation({
    summary: "카카오 로그인",
    description: "인가 코드를 받아 유저를 생성하고 쿠키에 토큰을 담아 반환",
  })
  @HttpCode(200)
  @ApiBody({ type: KakaoLoginRequestDto })
  @ApiResponse({ status: 200, type: KakaoLoginResponseDto })
  @Post("/kakao")
  async kakaoLogin(
    @Body() body: KakaoLoginRequestDto
  ): Promise<KakaoLoginResponseDto> {
    // 카카오 서버와 통신하여 액세스 토큰을 발급받음
    const accessToken = await this.authService.getAccessToken(body.code);

    // 액세스 토큰을 통해 사용자 정보 가져옴
    const kakaoUserInfo = await this.authService.getUserInfo(accessToken);

    // DB에 사용자 정보 저장 또는 찾기
    const userInfoDto = await this.usersService.findOrCreateById(
      kakaoUserInfo.id
    );

    // JWT 토큰 발급
    const token = await this.authService.getToken(userInfoDto.payload);

    // 쿠키에 액세스 토큰과 리프레시 토큰 설정
    await this.authService.saveRefreshToken(
      token.refreshToken,
      userInfoDto.payload.id
    );

    console.log("회원가입 여부 : ", userInfoDto.isSignedUp);

    return new KakaoLoginResponseDto(
      token.accessToken,
      token.refreshToken,
      userInfoDto.payload.id,
      userInfoDto.isSignedUp
    );
  }

  @ApiBearerAuth("accessToken")
  @Post("/signup")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "회원가입" })
  @ApiBody({ type: SignUpRequestDto })
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("profileImage"))
  @ApiResponse({
    status: 201,
    description: "회원가입 성공 시",
  })
  async signup(
    @AccessUser() user: JwtPayload,
    @UploadedFile() profileImage: Express.Multer.File,
    @Body() signupDto: SignUpRequestDto
  ): Promise<void> {
    console.log(signupDto);
    await this.usersService.signup(signupDto, profileImage, user.id);
  }

  @ApiBearerAuth("refreshToken")
  @Post("/refresh")
  @UseGuards(AuthGuard("jwt-refresh"))
  @ApiOperation({
    summary: "Token 재발급",
    description:
      "refreshToken을 이용하여 accessToken, refreshToken을 재발급합니다.",
  })
  @ApiResponse({
    status: 201,
    description: "Token 재발급 성공 시",
    type: TokenResponseDto,
  })
  async refresh(
    @RefreshUser() user: RefreshTokenPayload
  ): Promise<TokenResponseDto> {
    return await this.authService.refreshToken(user);
  }

  @ApiBearerAuth("accessToken")
  @Post("/logout")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({
    summary: "로그아웃",
    description: "서버에 저장된 refreshToken을 삭제합니다.",
  })
  @ApiResponse({ status: 201, description: "로그아웃 성공 시" })
  async logout(@AccessUser() user: JwtPayload): Promise<void> {
    await this.authService.removeRefreshToken(user.id);
  }
}
