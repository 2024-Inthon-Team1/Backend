import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CassetteEntity } from "src/entity/cassette.entity";
import { UsersEntity } from "src/entity/users.entity";
import { Repository } from "typeorm";
import { CreateCassettesRequestDto } from "./dto/create-cassette-request.dto";
import { CreateCassetteResponseDto } from "./dto/create-cassette-response.dto";

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
}
