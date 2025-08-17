import { Injectable } from '@nestjs/common'
import { WSGateway } from './ws.gateway'

@Injectable()
export class WSService {
  constructor(private readonly gateway: WSGateway) {}

  getServer() {
    return this.gateway.getServer()
  }
}
