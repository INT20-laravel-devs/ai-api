import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { OpenAiModule } from '../open-ai/open-ai.module';
import { ChatService } from './chat.service';
import { ChatController } from './chat.contoller';
import { PrismaService } from '../../database/prisma.service';

@Module({
  providers: [ChatGateway, ChatService, PrismaService],
  controllers: [ChatController],
  imports: [OpenAiModule],
})
export class ChatModule {}
