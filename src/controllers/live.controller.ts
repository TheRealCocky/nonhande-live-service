import { Controller, Post, Body, Get, Param, Req, BadRequestException } from '@nestjs/common';
import { LiveService } from '../services/live.service';
import { CreateRoomDto } from '../dto/create-room.dto';

@Controller('live')
export class LiveController {
  constructor(private readonly liveService: LiveService) {}

  // ROTA PARA O FRONTEND BUSCAR ALUNOS REAIS
  @Get('users')
  async getUsers() {
    return this.liveService.getAvailableUsers();
  }

  @Post('room')
  async createRoom(@Body() dto: CreateRoomDto & { callerId?: string }, @Req() req: any) {
    // Prioridade 1: ID do Token (Segurança)
    // Prioridade 2: ID enviado pelo Body (Debug/Demo)
    const userId = req.user?.id || dto.callerId;

    if (!userId) {
      throw new BadRequestException('Mestre, é necessário o ID do Professor (Caller).');
    }

    return this.liveService.initSession(userId, dto);
  }

  @Get('room/:roomId')
  async checkRoom(@Param('roomId') roomId: string) {
    return this.liveService.getRoomStatus(roomId);
  }

  @Post('room/:roomId/end')
  async closeRoom(@Param('roomId') roomId: string) {
    return this.liveService.endSession(roomId);
  }

  @Get('health')
  async healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      message: 'Nonhande Live Service is awake 🇦🇴'
    };
  }
}