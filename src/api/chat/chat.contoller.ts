import { Body, Controller, Delete, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { Request } from 'express';
import { AuthGuard } from '../auth/guard/auth.guard';

@ApiTags('Chat')
@Controller('/chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(AuthGuard())
  @Post()
  async createChat(@Body() body: { name: string }, @Req() req: Request) {
    return this.chatService.createChat(body.name, req['user'].id);
  }

  @UseGuards(AuthGuard())
  @Delete()
  async deleteChat(@Body() body: { threadId: string }) {
    return this.chatService.deleteChat(body.threadId);
  }
}
