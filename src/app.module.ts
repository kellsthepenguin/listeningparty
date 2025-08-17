import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { RoomsController } from './room/room.controller'
import { RedisModule } from '@nestjs-modules/ioredis'

@Module({
  imports: [
    RedisModule.forRoot({
      type: 'single',
      url: 'redis://localhost:6379'
    })
  ],
  controllers: [AppController, RoomsController],
  providers: [AppService]
})
export class AppModule {}
