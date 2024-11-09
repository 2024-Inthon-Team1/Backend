// room.service.ts
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { RoomDto } from "./dto/chat.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ChatEntity } from "src/entity/chat.entity";
import { Repository } from "typeorm";
import { RoomEntity } from "src/entity/room.entity";
import { UsersEntity } from "src/entity/users.entity";
import { ChatUserEntity } from "src/entity/chat-user.entity";
import { SocketUserEntity } from "src/entity/socket-user.entity";

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
    @InjectRepository(ChatEntity)
    private readonly chatRepository: Repository<ChatEntity>,
    @InjectRepository(ChatUserEntity)
    private readonly chatUserRepository: Repository<ChatUserEntity>,
    @InjectRepository(SocketUserEntity)
    private readonly socketUserRepository: Repository<SocketUserEntity>
  ) {}

  async createRoom(receiverId: string, senderId: string): Promise<RoomEntity> {
    let invitor = await this.chatUserRepository.findOne({
      where: { userId: receiverId },
    });
    let invitee = await this.chatUserRepository.findOne({
      where: { userId: senderId },
    });

    if (!invitor) {
      const user = await this.usersRepository.findOne({
        where: { id: receiverId },
      });
      invitor = this.chatUserRepository.create({
        userId: receiverId,
        username: user.username,
        profileUrl: user.profileUrl,
      });
    }

    if (!invitee) {
      const user = await this.usersRepository.findOne({
        where: { id: senderId },
      });
      invitee = this.chatUserRepository.create({
        userId: senderId,
        username: user.username,
        profileUrl: user.profileUrl,
      });
    }

    // 3. Room 생성 또는 존재 여부 확인
    const roomId = `room_${Math.min(Number(senderId), Number(receiverId))}_${Math.max(Number(senderId), Number(receiverId))}`;
    let room = await this.roomRepository.findOne({ where: { id: roomId } });

    if (!room) {
      const newRoom = this.roomRepository.create({
        id: roomId,
        invitor: receiverId,
        invitee: senderId,
      });
      await this.roomRepository.save(newRoom);
    }

    invitor.roomId = roomId;
    invitee.roomId = roomId;

    await this.chatUserRepository.save(invitor);
    await this.chatUserRepository.save(invitee);

    return room;
  }

  // async saveMessage(
  //   roomId: string,
  //   userId: string,
  //   message: string
  // ): Promise<Chat> {
  //   const chatMessage = new this.chatModel({ roomId, userId, message });
  //   return await chatMessage.save();
  // }

  // async getMessagesByRoomId(roomId: string): Promise<Chat[]> {
  //   return await this.chatModel.find({ roomId }).sort({ createdAt: 1 }).exec();
  // }

  async getChatRooms(userId: string): Promise<any[]> {
    const rooms = await this.roomRepository.find({
      where: [{ invitor: userId }, { invitee: userId }],
      relations: ["chats"], // 필요한 관계를 함께 로드
    });

    console.log(rooms);

    const response = await Promise.all(
      rooms.map(async (room) => {
        const otherId = room.invitee === userId ? room.invitor : room.invitee;

        // 상대방 사용자 정보 조회
        const otherUser = await this.usersRepository.findOne({
          where: { id: otherId },
        });

        // 마지막 메시지 조회
        const lastMessage = await this.chatRepository
          .createQueryBuilder("chat")
          .where("chat.room = :roomId", { roomId: room.id })
          .orderBy("chat.createdAt", "DESC")
          .getOne();

        return {
          roomId: room.id,
          otherUser: otherUser?.username || null,
          lastMessage: lastMessage?.message || null,
          lastMessageTime: lastMessage?.createdAt || null,
        };
      })
    );

    return response;
  }

  async getChats(roomId: string, userId: string) {
    // roomId와 userId를 ObjectId 형식으로 변환
    const room = await this.roomRepository
      .createQueryBuilder("room")
      .leftJoinAndSelect("room.chats", "chat")
      .where("room.id = :roomId", { roomId })
      .orderBy("chat.createdAt", "ASC") // 옛날 -> 최근 순으로 정렬
      .getOne();

    return room.chats;
  }

  // 방에 입장
  async joinRoom(userId: string, roomId: string, socketId: string) {
    // SocketUser 생성 및 연결 정보 저장
    const socketUser = await this.socketUserRepository.save({
      socketId,
      user: { id: userId },
      room: { id: roomId },
      connectedAt: new Date(),
    });

    return socketUser;
  }

  // 방에서 나가기
  async leaveRoom(userId: string, roomId: string, socketId: string) {
    await this.socketUserRepository.delete({ socketId, room: { id: roomId } });
  }

  // 메시지 저장
  async sendMessage(userId: string, roomId: string, message: string) {
    const chatMessage = await this.chatRepository.save({
      sender: { id: userId },
      room: { id: roomId },
      message,
      createdAt: new Date(),
    });

    return chatMessage;
  }

  // 소켓 연결 정보 저장
  async saveSocketUser(userId: string, socketId: string, roomId: string) {
    return await this.socketUserRepository.save({
      socketId,
      user: { id: userId },
      room: { id: roomId },
      connectedAt: new Date(),
    });
  }

  // 소켓 연결 정보 삭제
  async removeSocketUser(socketId: string) {
    await this.socketUserRepository.delete({ socketId });
  }
}