import { GiftService } from "./gift.service";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { CassetteService } from "./cassette.service";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from "@nestjs/swagger";
import { CassetteEntity } from "src/entity/cassette.entity";
import { AccessUser } from "src/common/decorators/accessUser.decorator";
import { JwtPayload } from "src/common/interface/auth.interface";
import { CreateCassetteRequestDto } from "./dto/create-cassette-request.dto";
import { CreateCassetteResponseDto } from "./dto/create-cassette-response.dto";
import { SendCassetteGiftRequestDto } from "./dto/send-cassette-gift-request.dto";
import { DeleteCassetteResponseDto } from "./dto/delete-cassette-response.dtd";
import { GiftEntity } from "src/entity/gift.entity";
import { AuthGuard } from "@nestjs/passport";

@Controller("cassette")
@ApiBearerAuth("accessToken")
@UseGuards(AuthGuard("jwt"))
export class CassetteController {
  constructor(
    private readonly cassetteService: CassetteService,
    private readonly giftService: GiftService
  ) {}

  @ApiOperation({
    summary: "카세트 테잎 컬렉션 조회",
    description: "카세트 테잎 컬렉션을 조회합니다.",
  })
  @ApiResponse({
    status: 200,
    type: [CassetteEntity],
  })
  @Get()
  async getCassettes(
    @AccessUser() user: JwtPayload
  ): Promise<CassetteEntity[]> {
    return await this.cassetteService.getCassettes(user.id);
  }

  @ApiOperation({
    summary: "카세트 테잎 컬렉션 추가",
    description: "카세트 테잎 컬렉션을 추가합니다.",
  })
  @ApiBody({ type: CreateCassetteRequestDto })
  @ApiResponse({
    status: 201,
    type: CreateCassetteResponseDto,
  })
  @Post()
  async createCassette(
    @AccessUser() user: JwtPayload,
    @Body() body: CreateCassetteRequestDto
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
  @Delete("/:cassetteId")
  async deleteCassette(
    @AccessUser() user: JwtPayload,
    @Param("cassetteId") cassetteId: number
  ): Promise<DeleteCassetteResponseDto> {
    return await this.cassetteService.deleteCassette(user.id, cassetteId);
  }

  @ApiOperation({
    summary: "받은 카세트 테잎 선물 조회",
    description: "받은 카세트 테잎 선물을 조회합니다.",
  })
  @ApiResponse({
    status: 200,
    type: [GiftEntity],
  })
  @Get("/gift")
  async getCassetteGift(@AccessUser() user: JwtPayload): Promise<GiftEntity[]> {
    return await this.giftService.getCassetteGift(user.id);
  }

  @ApiOperation({
    summary: "카세트 테잎 선물하기",
    description:
      "특정 유저에게 카세트 테잎 컬렉션을 선물합니다. 컬렉션은 5개까지 선택 가능합니다.",
  })
  @ApiBody({
    type: SendCassetteGiftRequestDto,
  })
  @ApiResponse({
    status: 201,
    type: GiftEntity,
  })
  @Post("/gift")
  async sendCassetteGift(
    @AccessUser() user: JwtPayload,
    @Body() body: SendCassetteGiftRequestDto
  ): Promise<GiftEntity> {
    return await this.giftService.sendCassetteGift(user.id, body);
  }
}
