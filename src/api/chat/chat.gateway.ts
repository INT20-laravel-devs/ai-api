import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer()
  private server: Server;

  @SubscribeMessage('join')
  async joinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { threadId: string },
  ) {
    if (!client.rooms.has(body.threadId)) {
      client.rooms.add(body.threadId);
    }
    await client.join(body.threadId);
    const history = await this.chatService.getChatHistory(body.threadId);
    if (history) {
      client.emit('join', history);
    } else {
      client.emit('join', []);
    }
  }

  @SubscribeMessage('message')
  async handleMessage(@MessageBody() data: { threadId: string; content: string }) {
    const answer = await this.chatService.createMessage(data.threadId, data.content);
    this.server.to(data.threadId).emit('message', answer);
  }

  @SubscribeMessage('leave')
  leaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { threadId: string },
  ) {
    client.rooms.delete(body.threadId);
  }
}
