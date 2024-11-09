import { Types } from "mongoose";

export class CreateRoomDto {
  roomId: string;
  invitor: string;
  invitee: string;
  name: string;
}
