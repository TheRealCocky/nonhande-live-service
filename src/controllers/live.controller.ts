import { Controller, Post, Body, Get, Param, Req, BadRequestException } from '@nestjs/common';
import { LiveService } from '../services/live.service';
import { CreateRoomDto } from '../dto/create-room.dto';

@Controller('live')
export class LiveController {
  constructor(private readonly liveService: LiveService) {}

  /**
   * Recupera a lista de usuários (alunos) para o professor selecionar no frontend.
   * Evita a necessidade de copiar IDs manualmente.
   */
  @Get('users')
  async getUsers() {
    return this.liveService.getAvailableUsers();
  }

  /**
   * Inicia uma nova sessão de aula (Call).
   * O callerId é validado via DTO para evitar erro de ObjectID malformado.
   */
  @Post('room')
  async createRoom(@Body() dto: CreateRoomDto) {
    // Usamos o callerId que vem no body (enviado pelo frontend)
    // Isso garante compatibilidade total com o MongoDB Atlas.
    const userId = dto.callerId;

    if (!userId) {
      throw new BadRequestException('Mestre, o ID do Professor (callerId) é obrigatório.');
    }

    return this.liveService.initSession(userId, dto);
  }

  /**
   * Verifica se uma sala existe e se o status é 'ONGOING'.
   */
  @Get('room/:roomId')
  async checkRoom(@Param('roomId') roomId: string) {
    return this.liveService.getRoomStatus(roomId);
  }

  /**
   * Encerra a sessão de aula, alterando o status para 'COMPLETED'.
   */
  @Post('room/:roomId/end')
  async closeRoom(@Param('roomId') roomId: string) {
    return this.liveService.endSession(roomId);
  }

  /**
   * Verificação de saúde do microserviço.
   */
  @Get('health')
  async healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      message: 'Nonhande Live Service is awake 🇦🇴'
    };
  }
}