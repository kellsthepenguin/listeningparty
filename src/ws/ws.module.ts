import { Module } from '@nestjs/common'
import { WSGateway } from './ws.gateway'
import { AuthModule } from '../auth/auth.module'
import { WSService } from './ws.service'

@Module({
  imports: [AuthModule],
  controllers: [],
  providers: [WSGateway, WSService],
  exports: [WSService]
})
export class WSModule {}
