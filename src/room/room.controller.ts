import { Body, Controller, Post, Put, UseGuards } from '@nestjs/common'
import { RoomService } from './room.service'
import { CreateRoomDto } from './dto'
import { AuthGuard } from 'src/auth/auth.guard'
import { CurrentUserId } from 'src/decorators/current-user-id.decorator'
import { JoinRoomDto } from './dto/join-room.dto'
import { AddToQueueDto } from './dto/add-to-queue.dto'

@Controller('room')
@UseGuards(AuthGuard)
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  async create(
    @CurrentUserId() userId: string,
    @Body() createRoomDto: CreateRoomDto
  ) {
    const room = await this.roomService.create(userId, createRoomDto)
    return this.roomService.join(userId, room!)
  }

  @Put()
  async join(
    @CurrentUserId() userId: string,
    @Body() joinRoomDto: JoinRoomDto
  ) {
    return this.roomService.join(userId, joinRoomDto)
  }

  @Put('/queue')
  async addToQueue(
    @CurrentUserId() userId: string,
    @Body() addToQueueDto: AddToQueueDto
  ) {
    return this.roomService.addToQueue(userId, addToQueueDto)
  }
}
