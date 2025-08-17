import { Injectable, Logger } from '@nestjs/common'
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets'
import type { Server, Socket } from 'socket.io'
import { AuthService } from 'src/auth/auth.service'

@Injectable()
@WebSocketGateway()
export class WSGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger('WsGateway')
  @WebSocketServer() private server: Server

  constructor(private readonly authService: AuthService) {}

  afterInit() {
    this.logger.log('WS Gateway Initialized')
  }

  async handleConnection(client: Socket) {
    client.emit('token', await this.authService.sign(client.id))
  }

  handleDisconnect(client: Socket) {}

  getServer() {
    return this.server
  }
}
