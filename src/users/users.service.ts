import { SignUpRequestDto } from "./../auth/dto/sign-up-request.dto";
import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersEntity } from "src/entity/users.entity";
import { LessThanOrEqual, Not, Repository } from "typeorm";
import { UserInfoDto } from "./dto/user-info.dto";
import { CassetteEntity } from "src/entity/cassette.entity";
import { GetProfileResponseDto } from "./dto/get-profile-response.dto";
import { CursorPageOptionsDto } from "src/common/dto/CursorPageOptions.dto";
import { GetRandomUsersSignatureSongResponseDto } from "./dto/get-random-users-signature-song-response.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>
  ) {}

  async findOrCreateById(id: string): Promise<UserInfoDto> {
    let isSignedUp = true;
    let user = await this.usersRepository.findOne({ where: { id } });
    if (!user || (user && !user.username)) isSignedUp = false;
    if (!user) {
      user = this.usersRepository.create({
        id,
      });
      await this.usersRepository.save(user);
    }
    return new UserInfoDto(user, isSignedUp);
  }

  async signup(
    signupRequestDto: SignUpRequestDto,
    userId: string
  ): Promise<void> {
    const {
      sex,
      birthday,
      username,
      profileUrl,
      signatureSong,
      signatureSongArtist,
    } = signupRequestDto;
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    user.sex = sex;
    user.birthday = birthday;
    user.username = username;
    user.profileUrl = profileUrl;
    user.signatureSong = signatureSong;
    user.signatureSongArtist = signatureSongArtist;

    await this.usersRepository.save(user);
  }

  async getProfile(userId: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    return new GetProfileResponseDto(user);
  }

  async getRandomUsersSignatureSong(
    userId: string
  ): Promise<GetRandomUsersSignatureSongResponseDto[]> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    const randomUsers = await this.usersRepository
      .createQueryBuilder("user")
      .where("user.sex != :sex", { sex: user.sex })
      .orderBy("RAND()")
      .limit(10)
      .getMany();

    return randomUsers.map((randomUser) => {
      return new GetRandomUsersSignatureSongResponseDto(randomUser);
    });
  }
}
