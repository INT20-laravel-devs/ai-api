import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { OpenAiService } from '../open-ai/open-ai.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly openAiService: OpenAiService,
  ) {}

  async getChatHistory(threadId: string) {
    return this.prisma.conversation.findFirst({
      where: {
        threadId,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });
  }

  private async baseCreateMessage(threadId: string, content: string) {
    await this.prisma.message.create({
      data: {
        content,
        threadId,
      },
    });
  }

  async createMessage(threadId: string, content: string, userId: string) {
    await this.baseCreateMessage(threadId, content);
    const response = await this.openAiService.addMessageToThread(
      threadId,
      content,
      userId,
    );
    await this.baseCreateMessage(threadId, response);
    return { content: response };
  }

  async createChat(name: string, userId: string) {
    const thread = await this.openAiService.createThread();
    return this.prisma.conversation.create({
      data: {
        name,
        threadId: thread.id,
        userId,
      },
    });
  }

  async deleteChat(threadId: string) {
    return this.prisma.conversation.delete({
      where: {
        threadId,
      },
    });
  }
}
