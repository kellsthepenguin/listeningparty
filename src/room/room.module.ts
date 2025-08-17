import { Module } from '@nestjs/common'
import { RoomController } from './room.controller'
import { RoomService } from './room.service'
import { AuthModule } from '../auth/auth.module'
import { WSModule } from '../ws/ws.module'

@Module({
  imports: [AuthModule, WSModule],
  controllers: [RoomController],
  providers: [RoomService]
})
export class RoomModule {}
