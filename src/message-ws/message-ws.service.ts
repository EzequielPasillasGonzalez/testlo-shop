import { Injectable } from '@nestjs/common';
import { ConnectedClients } from './interfaces/connected-clients.interfaces';
import { Socket } from 'socket.io';

@Injectable()
export class MessageWsService {
  private connectedClients: ConnectedClients = {};

  registerClient(client: Socket): void {
    this.connectedClients[client.id] = client;
  }

  removeClient(clientId: string): void {
    delete this.connectedClients[clientId];
  }

  getConnectedClients(): string[] {
    return Object.keys(this.connectedClients);
  }
}
