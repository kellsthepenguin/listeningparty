import { Module } from '@nestjs/common'
import { WSGateway } from './ws.gateway'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [AuthModule],
  controllers: [],
  providers: [WSGateway]
})
export class WSModule {}
