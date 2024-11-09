import { SignUpRequestDto } from "./../auth/dto/sign-up-request.dto";
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersEntity } from "src/entity/users.entity";
import { Repository } from "typeorm";
import { UserInfoDto } from "./dto/user-info.dto";
import { GetProfileResponseDto } from "./dto/get-profile-response.dto";
import { GetRandomUsersSignatureSongResponseDto } from "./dto/get-random-users-signature-song-response.dto";
import { FileService } from "src/common/file.service";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
    private readonly fileService: FileService
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
    profileImage: Express.Multer.File,
    userId: string
  ): Promise<void> {
    if (!this.fileService.imagefilter(profileImage)) {
      throw new BadRequestException("Only image file can be uploaded!");
    }
    const profileUrl = await this.fileService.uploadFile(
      profileImage,
      "User",
      "ProfileImage"
    );
    const {
      sex,
      birthday,
      username,
      signatureSongId,
      signatureSong,
      signatureSongArtist,
    } = signupRequestDto;
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    user.sex = sex;
    user.birthday = birthday;
    user.username = username;
    user.profileUrl = profileUrl;
    user.signatureSongId = signatureSongId;
    user.signatureSong = signatureSong;
    user.signatureSongArtist = signatureSongArtist;

    await this.usersRepository.save(user);
  }

  async getProfile(userId: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    const profileUrl = this.fileService.makeUrlByFileDir(user.profileUrl);
    return new GetProfileResponseDto(user, profileUrl);
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
