import { JwtPayload } from "src/common/interface/auth.interface";
import { UsersEntity } from "src/entity/users.entity";

export class UserInfoDto {
  payload: JwtPayload;

  isSignedUp: boolean;

  constructor(user: UsersEntity, isSignedUp: boolean) {
    this.payload = {
      id: user.id,
      signedAt: new Date().toISOString(),
    };
    this.isSignedUp = isSignedUp;
  }
}
