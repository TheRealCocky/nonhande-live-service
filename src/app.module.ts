import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { LiveController } from './controllers/live.controller';
import { LiveService } from './services/live.service';
import { LiveGateway } from './gateways/live.gateway';

@Module({
  imports: [PrismaModule],
  controllers: [LiveController],
  providers: [LiveService, LiveGateway],
})
export class AppModule {}
