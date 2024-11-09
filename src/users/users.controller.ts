import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
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
    description: "유저 프로필을 조회합니다.",
  })
  @ApiResponse({
    status: 200,
    type: GetProfileResponseDto,
  })
  @Get("/profile")
  async getProfile(
    @AccessUser() user: JwtPayload
  ): Promise<GetProfileResponseDto> {
    return await this.usersService.getProfile(user.id);
  }
}
