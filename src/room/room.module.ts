import { Module } from '@nestjs/common'
import { RoomController } from './room.controller'
import { RoomService } from './room.service'
import { AuthModule } from 'src/auth/auth.module'

@Module({
  imports: [AuthModule],
  controllers: [RoomController],
  providers: [RoomService]
})
export class RoomModule {}
