import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageDto } from './dto/message.dto';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway {
  @WebSocketServer()
  private server: Server;

  private chatHistory = new Map<string, MessageDto[]>();

  @SubscribeMessage('join')
  async joinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { questId: string },
  ) {
    if (!client.rooms.has(body.questId)) {
      client.rooms.add(body.questId);
    }
    await client.join(body.questId);
    const history = this.chatHistory.get(body.questId);
    if (history) {
      client.emit('join', history);
    } else {
      this.chatHistory.set(body.questId, []);
      client.emit('join', []);
    }
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: MessageDto) {
    this.server.to(data.questId).emit('message', data);
    const history = this.chatHistory.get(data.questId);
    history.push(data);
  }

  @SubscribeMessage('leave')
  leaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { questId: string },
  ) {
    client.rooms.delete(body.questId);
    if (this.server.sockets.adapter.rooms.get(body.questId)?.size === 0) {
      this.chatHistory.delete(body.questId);
    }
  }
}
