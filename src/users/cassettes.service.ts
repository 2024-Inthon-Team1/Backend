import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CassetteEntity } from "src/entity/cassette.entity";
import { UsersEntity } from "src/entity/users.entity";
import { Repository } from "typeorm";
import { CreateCassettesRequestDto } from "./dto/create-cassette-request.dto";
import { CreateCassetteResponseDto } from "./dto/create-cassette-response.dto";
import { DeleteCassetteResponseDto } from "./dto/delete-cassette-response.dtd";

@Injectable()
export class CassetteService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
    @InjectRepository(CassetteEntity)
    private readonly cassetteRepository: Repository<CassetteEntity>
  ) {}

  async createCassette(
    userId: string,
    requestDto: CreateCassettesRequestDto
  ): Promise<CreateCassetteResponseDto> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    const { title, artist, review } = requestDto;
    const cassette = this.cassetteRepository.create({
      title,
      artist,
      review,
      user,
    });

    await this.cassetteRepository.save(cassette);

    return new CreateCassetteResponseDto(true);
  }

  async deleteCassette(userId: string, cassetteId: number) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    const cassette = await this.cassetteRepository.findOne({
      where: { id: cassetteId, user },
    });

    if (!cassette) {
      throw new NotFoundException("cassette 정보를 찾을 수 없습니다.");
    }

    const deleted = await this.cassetteRepository.delete(cassette);
    if (deleted.affected === 0) {
      throw new InternalServerErrorException("삭제에 실패했습니다.");
    }

    return new DeleteCassetteResponseDto(true);
  }
}
