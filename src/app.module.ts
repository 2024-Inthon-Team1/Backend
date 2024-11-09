import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ChatGateway } from "./chat/chat.gateway";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CassetteModule } from "./cassette/cassette.module";
import { MongooseModule } from "@nestjs/mongoose";
import { CommonModule } from "./common/common.module";

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env", isGlobal: true }),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>("MONGO_URL"),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    }),
    UsersModule,
    AuthModule,
    CassetteModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule {}
