import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { RedisModule } from '@nestjs-modules/ioredis'
import { RoomModule } from './room/room.module'
import { WSModule } from './ws/ws.module'
import { AuthModule } from './auth/auth.module'

@Module({
  imports: [
    RedisModule.forRoot({
      type: 'single',
      url: 'redis://localhost:6379'
    }),
    RoomModule,
    WSModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
