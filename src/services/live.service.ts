import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto } from '../dto/create-room.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LiveService {
  constructor(private prisma: PrismaService) {}

  // --- NOVO MÉTODO PARA O FRONTEND ---
  async getAvailableUsers() {
    // Busca usuários para o professor escolher, excluindo campos sensíveis
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
      take: 20, // Limita para não sobrecarregar a rede
    });
  }

  async initSession(userId: string, dto: CreateRoomDto) {
    // Validação de segurança: Verifica se os IDs são válidos antes de tentar criar
    if (!userId.match(/^[0-9a-fA-F]{24}$/) || !dto.calleeId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestException('Os IDs fornecidos não são válidos para o MongoDB.');
    }

    return this.prisma.call.create({
      data: {
        roomId: uuidv4(),
        callerId: userId,
        calleeId: dto.calleeId,
        status: 'ONGOING',
        startedAt: new Date(),
      },
    });
  }

  async getRoomStatus(roomId: string) {
    const room = await this.prisma.call.findUnique({ where: { roomId } });
    if (!room || room.status !== 'ONGOING') {
      throw new NotFoundException('Sala não encontrada ou já encerrada');
    }
    return room;
  }

  async endSession(roomId: string) {
    return this.prisma.call.update({
      where: { roomId },
      data: {
        status: 'COMPLETED',
        endedAt: new Date()
      },
    });
  }
}