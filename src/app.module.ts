import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { RoomController } from './room/room.controller'
import { RedisModule } from '@nestjs-modules/ioredis'
import { WSGateway } from './ws.gateway'
import { RoomModule } from './room/room.module'

@Module({
  imports: [
    RedisModule.forRoot({
      type: 'single',
      url: 'redis://localhost:6379'
    }),
    RoomModule
  ],
  controllers: [AppController],
  providers: [AppService, WSGateway]
})
export class AppModule {}
