import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { UsersEntity } from "src/entity/users.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CassetteService } from "./cassettes.service";
import { CassetteEntity } from "src/entity/cassette.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity, CassetteEntity])],
  controllers: [UsersController],
  providers: [UsersService, CassetteService],
})
export class UsersModule {}
