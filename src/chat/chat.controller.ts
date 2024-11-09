import { Controller, Get, Param, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { ChatService } from "./chat.service";
import { AccessUser } from "src/common/decorators/accessUser.decorator";
import { JwtPayload } from "src/common/interface/auth.interface";

@Controller("chat")
@ApiBearerAuth("accessToken")
@UseGuards(AuthGuard("jwt"))
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @ApiOperation({
    summary: "채팅방 리스트 조회",
    description: "채팅방 정보를 가져옵니다.",
  })
  @Get("/rooms")
  async getChatRooms(@AccessUser() user: JwtPayload) {
    return await this.chatService.getChatRooms(user.id);
  }

  @ApiOperation({
    summary: "채팅 조회",
    description: "채팅방에서 채팅 정보 조회합니다.",
  })
  @Get("/:roomId")
  async getChats(
    @AccessUser() user: JwtPayload,
    @Param("roomId") roomId: string
  ) {
    return await this.chatService.getChats(roomId, user.id);
  }
}
