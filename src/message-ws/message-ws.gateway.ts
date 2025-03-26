import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';
import { MessageWsService } from './message-ws.service';
import { Socket } from 'socket.io';

@WebSocketGateway({ cors: true, namespace: '/' })
export class MessageWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly messageWsService: MessageWsService) {}
  
  handleDisconnect(client: Socket) {
    console.log('cliente desconectado:', client.id);
  }
  handleConnection(client: Socket, ...args: any[]) {
    console.log('cliente conectado:', client.id);
  }
}
