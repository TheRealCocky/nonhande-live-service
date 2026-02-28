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
    // 1. LOGS DE SEGURANÇA (Vais ver isto no terminal do VSCode ou no log do Render)
    console.log('--- [DEBUG INICIAR SESSÃO] ---');
    console.log('ID do Professor (userId):', `"${userId}"`); // Ver se tem aspas extras ou espaços
    console.log('ID do Aluno (calleeId):', `"${dto.calleeId}"`);
    console.log('Título da Aula:', dto.title);
    console.log('------------------------------');

    // 2. VALIDAÇÃO FLEXÍVEL
    // Verificamos se os IDs existem. Se o Regex for muito rígido, a demo falha por um espaço vazio.
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;

    if (!userId || !objectIdRegex.test(userId)) {
      throw new BadRequestException(`ID do Professor inválido: ${userId}`);
    }

    if (!dto.calleeId || !objectIdRegex.test(dto.calleeId)) {
      throw new BadRequestException(`ID do Aluno inválido: ${dto.calleeId}`);
    }

    try {
      // 3. CRIAÇÃO NO PRISMA
      return await this.prisma.call.create({
        data: {
          roomId: uuidv4(),
          callerId: userId,
          calleeId: dto.calleeId,
          status: 'ONGOING',
          startedAt: new Date(),
        },
      });
    } catch (error) {
      console.error('❌ Erro Crítico no Prisma:', error);
      throw new BadRequestException('Maka ao gravar no MongoDB Atlas. Verifica a conexão.');
    }
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