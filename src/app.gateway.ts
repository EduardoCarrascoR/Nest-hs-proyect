import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { PORT_GATEWAY } from "./config/constants";

@WebSocketGateway(4001, { transports: 'websocket', namespace: '/websocket', serveClient: true} )
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
  @WebSocketServer()
  wss: Server;

  private logger = new Logger('NestGateway');
  config : ConfigService

  afterInit(server: any){
    this.logger.log(`WebSocket Inicialized In port: 4001`)
  }

  /* @SubscribeMessage('Report')
  handleMessage(client: any, payload: any): string {
    this.logger.log('New client connected')
    return  client.emit('connection', 'successfully connected to server');
  } */

  handleConnection(client) {
    this.logger.log('New client connected')
    client.emit('connection', 'successfully connected to server')
  }

  handleDisconnect(client) {
    this.logger.log('Client disconnected')
  }
  
}
