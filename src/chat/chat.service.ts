// room.service.ts
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Room } from "./schema/room.schema";
import { Chat } from "./schema/chat.schema";
import { CreateRoomDto } from "./dto/chat.dto";
import { User } from "./schema/user.schema";

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<Room>,
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  async createRoom(senderId: string, receiverId: string): Promise<Room> {
    let invitor = await this.userModel.findOne({ userId: receiverId });
    let invitee = await this.userModel.findOne({ userId: senderId });

    if (!invitor) {
      invitor = await this.userModel.create({
        userId: receiverId,
        username: `User_${receiverId}`,
        profileUrl: `profile_${receiverId}`,
      });
    }

    if (!invitee) {
      invitee = await this.userModel.create({
        userId: senderId,
        username: `User_${senderId}`,
        profileUrl: `profile_${senderId}`,
      });
    }

    // 3. Room 생성 또는 존재 여부 확인
    const roomId = `room_${Math.min(Number(senderId), Number(receiverId))}_${Math.max(Number(senderId), Number(receiverId))}`;
    let room = await this.roomModel.findOne({ roomId });

    if (!room) {
      const newRoom = new this.roomModel({
        roomId,
        name: `Gift Chat - ${senderId} to ${receiverId}`,
        invitor: invitor._id,
        invitee: invitee._id,
      });
      room = await newRoom.save();
    }

    // 4. 초기 메시지 추가
    const initialMessage = new this.chatModel({
      roomId: room._id,
      senderId: invitor._id,
      message: `초대된 채팅방이 생성되었습니다.`,
    });
    await initialMessage.save();

    return room;
  }

  async addUserToRoom(roomId: string, userId: string): Promise<Room> {
    return await this.roomModel.findOneAndUpdate(
      { roomId },
      { $addToSet: { users: userId } }, // 중복 추가 방지
      { new: true }
    );
  }

  async saveMessage(
    roomId: string,
    userId: string,
    message: string
  ): Promise<Chat> {
    const chatMessage = new this.chatModel({ roomId, userId, message });
    return await chatMessage.save();
  }

  async getMessagesByRoomId(roomId: string): Promise<Chat[]> {
    return await this.chatModel.find({ roomId }).sort({ createdAt: 1 }).exec();
  }

  async getChatRooms(userId: string): Promise<any[]> {
    const id = new Types.ObjectId(userId);
    const rooms = await this.roomModel.find({
      $or: [{ invitor: id }, { invitee: id }],
    });
    console.log(rooms);
    return await this.roomModel.aggregate([
      {
        $match: {
          $or: [{ invitor: id }, { invitee: id }],
        },
      },
      {
        $lookup: {
          from: "chats", // Chat 컬렉션과 조인
          localField: "_id",
          foreignField: "roomId",
          as: "chats",
        },
      },
      {
        $addFields: {
          lastMessage: { $arrayElemAt: [{ $slice: ["$chats", -1] }, 0] }, // 마지막 메시지만 가져옴
        },
      },
      {
        $project: {
          _id: 1,
          roomId: 1,
          name: 1,
          "lastMessage.message": 1,
          "lastMessage.createdAt": 1,
        },
      },
      { $sort: { "lastMessage.createdAt": -1 } }, // 마지막 메시지 시간순으로 정렬
    ]);
  }
}
