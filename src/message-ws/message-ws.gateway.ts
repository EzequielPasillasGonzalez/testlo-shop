import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessageWsService } from './message-ws.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true, namespace: '/' })
export class MessageWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;
  constructor(private readonly messageWsService: MessageWsService) {}

  handleDisconnect(client: Socket): void {
    this.messageWsService.removeClient(client.id);
  }
  handleConnection(client: Socket, ...args: any[]): void {
    this.messageWsService.registerClient(client);

    this.wss.emit(
      'clients-updated',
      this.messageWsService.getConnectedClients(),
    );
  }
}
