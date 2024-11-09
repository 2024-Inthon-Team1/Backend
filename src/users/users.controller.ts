import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { AccessUser } from "src/common/decorators/accessUser.decorator";
import { JwtPayload } from "src/common/interface/auth.interface";
import { CassetteService } from "./cassettes.service";
import { CreateCassetteResponseDto } from "./dto/create-cassette-response.dto";
import { CreateCassettesRequestDto } from "./dto/create-cassette-request.dto";
import { AuthGuard } from "@nestjs/passport";

@Controller("users")
@ApiBearerAuth("accessToken")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cassetteService: CassetteService
  ) {}

  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({
    summary: "카세트 테잎 컬렉션 추가",
    description: "카세트 테잎 컬렉션을 추가합니다.",
  })
  @ApiBody({ type: CreateCassettesRequestDto })
  @ApiResponse({
    status: 201,
    description: "저장된 카세트 테잎 정보",
  })
  @Post("/cassettes")
  async createCassettes(
    @AccessUser() user: JwtPayload,
    @Body() body: CreateCassettesRequestDto
  ): Promise<CreateCassetteResponseDto> {
    return await this.cassetteService.createCassette(user.id, body);
  }
}
