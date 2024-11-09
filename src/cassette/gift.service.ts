import { ChatGateway } from "./../chat/chat.gateway";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GiftDetailEntity } from "src/entity/gift-detail.entity";
import { GiftEntity } from "src/entity/gift.entity";
import { Repository } from "typeorm";
import { SendCassetteGiftRequestDto } from "./dto/send-cassette-gift-request.dto";
import { CassetteEntity } from "src/entity/cassette.entity";
import { ChatService } from "src/chat/chat.service";
import { CreateRoomDto } from "src/chat/dto/chat.dto";

@Injectable()
export class GiftService {
  constructor(
    @InjectRepository(GiftEntity)
    private readonly giftRepository: Repository<GiftEntity>,
    @InjectRepository(CassetteEntity)
    private readonly cassetteRepository: Repository<CassetteEntity>,
    private readonly chatService: ChatService
  ) {}

  async getCassetteGift(userId: string): Promise<GiftEntity[]> {
    return await this.giftRepository.find({
      where: { receiverId: userId },
      relations: ["giftDetails"],
    });
  }

  async sendCassetteGift(
    senderId: string,
    requestDto: SendCassetteGiftRequestDto
  ): Promise<GiftEntity> {
    const { receiverId, cassetteIds, letter } = requestDto;
    // 1. cassetteIds에 해당하는 모든 CassetteEntity를 가져옵니다.
    const cassetteEntities = await Promise.all(
      cassetteIds.map(async (cassetteId) => {
        const cassette = await this.cassetteRepository.findOne({
          where: { id: cassetteId },
        });
        if (!cassette) {
          throw new NotFoundException(
            `Cassette with id ${cassetteId} not found`
          );
        }
        return cassette;
      })
    );

    // 2. 가져온 CassetteEntity를 순회하며 GiftDetailEntity를 생성합니다.
    const giftDetails = cassetteEntities.map((cassette) => {
      const giftDetail = new GiftDetailEntity();
      giftDetail.songId = cassette.songId;
      giftDetail.title = cassette.title;
      giftDetail.artist = cassette.artist; // 관계 설정
      return giftDetail;
    });

    console.log(giftDetails);

    // 3. GiftEntity를 생성하고, 필요한 정보와 함께 giftDetails를 포함시킵니다.
    const gift = new GiftEntity();
    gift.senderId = senderId;
    gift.receiverId = receiverId;
    gift.letter = letter;
    gift.giftDetails = giftDetails;

    // 4. GiftEntity를 저장합니다. (cascade 옵션에 의해 GiftDetailEntity도 함께 저장됨)
    return await this.giftRepository.save(gift);
  }

  async acceptCassetteGift(receiverId: string, giftId: number) {
    // 선물 수락 로직
    const gift = await this.giftRepository.findOne({ where: { id: giftId } });
    if (!gift || gift.receiverId !== receiverId) {
      throw new NotFoundException("선물을 찾을 수 없습니다.");
    }
    if (gift.isAccepted) {
      throw new BadRequestException("이미 수락한 선물입니다.");
    }
    gift.isAccepted = true;
    await this.giftRepository.save(gift);
    const room = await this.chatService.createRoom(receiverId, gift.senderId);

    console.log(room);
    if (room) {
      return true;
    }
    return false;
  }
}
