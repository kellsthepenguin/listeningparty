import { Logger } from '@nestjs/common'
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets'
import type { Socket, Server } from 'socket.io'

@WebSocketGateway({ path: '/ws' })
export class WSGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server
  private readonly logger = new Logger('ChatGateway')

  afterInit() {
    this.logger.log('WS Gateway Initialized')
  }

  handleConnection(client: Socket) {
    this.logger.log(client.id)
  }

  handleDisconnect(client: Socket) {}
}
