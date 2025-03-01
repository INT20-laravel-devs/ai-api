import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

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

  async createMessage(threadId: string, content: string) {
    await this.baseCreateMessage(threadId, content);

    const answer = ''; // call open ai, pass threadId, content
    await this.baseCreateMessage(threadId, answer);
    return { content: answer }; // answer from chat gpt
  }

  async createChat(name: string, userId: string) {
    // const threadId = // call open ai, pass name
    return this.prisma.conversation.create({
      data: {
        name,
        threadId: 'threadId', // change line
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
