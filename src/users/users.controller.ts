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
import { CassetteService } from "./cassettes.service";
import { CreateCassetteResponseDto } from "./dto/create-cassette-response.dto";
import { CreateCassettesRequestDto } from "./dto/create-cassette-request.dto";
import { AuthGuard } from "@nestjs/passport";
import { DeleteCassetteResponseDto } from "./dto/delete-cassette-response.dtd";
import { GetProfileResponseDto } from "./dto/get-profile-response.dto";
import { CassetteEntity } from "src/entity/cassette.entity";
import { GetRandomUsersSignatureSongResponseDto } from "./dto/get-random-users-signature-song-response.dto";

@Controller("users")
@ApiBearerAuth("accessToken")
@UseGuards(AuthGuard("jwt"))
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cassetteService: CassetteService
  ) {}

  @ApiOperation({
    summary: "카세트 테잎 컬렉션 조회",
    description: "카세트 테잎 컬렉션을 조회합니다.",
  })
  @ApiResponse({
    status: 200,
    type: [CassetteEntity],
  })
  @Get("/cassettes")
  async getCassettes(
    @AccessUser() user: JwtPayload
  ): Promise<CassetteEntity[]> {
    return await this.cassetteService.getCassettes(user.id);
  }

  @ApiOperation({
    summary: "카세트 테잎 컬렉션 추가",
    description: "카세트 테잎 컬렉션을 추가합니다.",
  })
  @ApiBody({ type: CreateCassettesRequestDto })
  @ApiResponse({
    status: 201,
    type: CreateCassetteResponseDto,
  })
  @Post("/cassettes")
  async createCassette(
    @AccessUser() user: JwtPayload,
    @Body() body: CreateCassettesRequestDto
  ): Promise<CreateCassetteResponseDto> {
    return await this.cassetteService.createCassette(user.id, body);
  }

  @ApiOperation({
    summary: "카세트 테잎 컬렉션 삭제",
    description: "카세트 테잎 컬렉션을 삭제합니다.",
  })
  @ApiParam({ name: "cassetteId", description: "cassette의 id" })
  @ApiResponse({
    status: 200,
    type: DeleteCassetteResponseDto,
  })
  @Delete("/cassettes/:cassetteId")
  async deleteCassette(
    @AccessUser() user: JwtPayload,
    @Param("cassetteId") cassetteId: number
  ): Promise<DeleteCassetteResponseDto> {
    return await this.cassetteService.deleteCassette(user.id, cassetteId);
  }

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
