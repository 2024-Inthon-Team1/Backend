import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { AccessUser } from "src/common/decorators/accessUser.decorator";
import { JwtPayload } from "src/common/interface/auth.interface";
import { AuthGuard } from "@nestjs/passport";
import { GetProfileResponseDto } from "./dto/get-profile-response.dto";
import { CassetteEntity } from "src/entity/cassette.entity";
import { GetRandomUsersSignatureSongResponseDto } from "./dto/get-random-users-signature-song-response.dto";

@Controller("users")
@ApiBearerAuth("accessToken")
@UseGuards(AuthGuard("jwt"))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: "유저 프로필 조회",
    description:
      "쿼리로 유저 id를 넘겨주는 경우 다른 유저, 없는 경우 본인 프로필을 조회합니다.",
  })
  @ApiResponse({
    status: 200,
    type: GetProfileResponseDto,
  })
  @ApiQuery({
    name: "userId",
    required: false,
  })
  @Get("/profile")
  async getProfile(
    @AccessUser() user: JwtPayload,
    @Query("userId") userId?: string
  ): Promise<GetProfileResponseDto> {
    const targetUserId = userId ?? user.id;
    return await this.usersService.getProfile(targetUserId);
  }

  @ApiOperation({
    summary: "유저 프로필 사진 조회",
    description:
      "쿼리로 유저 id를 넘겨주는 경우 다른 유저, 없는 경우 본인 프로필 사진 url을 조회합니다.",
  })
  @ApiResponse({
    status: 200,
    type: String,
  })
  @ApiQuery({
    name: "userId",
    required: false,
  })
  @Get("/profileImage")
  async getProfileImage(
    @AccessUser() user: JwtPayload,
    @Query("userId") userId?: string
  ) {
    const targetUserId = userId ?? user.id;
    return await this.usersService.getProfileImage(targetUserId);
  }

  @ApiOperation({
    summary: "랜덤 이성 유저 대표곡 조회",
    description: "다른 성별 유저의 대표곡을 랜덤으로 10개 조회합니다.",
  })
  @ApiResponse({
    status: 200,
    type: [GetRandomUsersSignatureSongResponseDto],
  })
  @Get("/finding")
  async getRandomUsersSignatureSong(
    @AccessUser() user: JwtPayload
  ): Promise<GetRandomUsersSignatureSongResponseDto[]> {
    return await this.usersService.getRandomUsersSignatureSong(user.id);
  }
}
