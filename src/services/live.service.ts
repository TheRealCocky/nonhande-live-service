import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Ajustado o path
import { CreateRoomDto } from '../dto/create-room.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LiveService {
  constructor(private prisma: PrismaService) {}

  async initSession(userId: string, dto: CreateRoomDto) {
    return this.prisma.call.create({
      data: {
        roomId: uuidv4(), // ID único para a sala (Socket.io usa este)
        callerId: userId,
        calleeId: dto.calleeId || '', // Usando o campo calleeId que existe no Schema
        status: 'ONGOING', // Em vez de 'isActive: true'
        startedAt: new Date(),
      },
    });
  }

  async getRoomStatus(roomId: string) {
    const room = await this.prisma.call.findUnique({ where: { roomId } });

    // Verificamos o status 'ONGOING' em vez de 'isActive'
    if (!room || room.status !== 'ONGOING') {
      throw new NotFoundException('Sala não encontrada ou já encerrada');
    }
    return room;
  }

  async endSession(roomId: string) {
    return this.prisma.call.update({
      where: { roomId },
      data: {
        status: 'COMPLETED', // Em vez de 'isActive: false'
        endedAt: new Date()
      },
    });
  }
}