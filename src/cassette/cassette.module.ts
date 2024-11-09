import { Module } from "@nestjs/common";
import { CassetteController } from "./cassette.controller";
import { UsersEntity } from "src/entity/users.entity";
import { CassetteEntity } from "src/entity/cassette.entity";
import { GiftEntity } from "src/entity/gift.entity";
import { GiftDetailEntity } from "src/entity/gift-detail.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CassetteService } from "./cassette.service";
import { GiftService } from "./gift.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsersEntity,
      CassetteEntity,
      GiftEntity,
      GiftDetailEntity,
    ]),
  ],
  controllers: [CassetteController],
  providers: [CassetteService, GiftService],
})
export class CassetteModule {}
