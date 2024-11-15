import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { UsersEntity } from "src/entity/users.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommonModule } from "src/common/common.module";

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity]), CommonModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
