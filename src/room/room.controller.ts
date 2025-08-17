import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { RoomService } from './room.service'
import { CreateRoomDto } from './dto'
import { AuthGuard } from 'src/auth/auth.guard'
import { CurrentUserId } from 'src/decorators/current-user-id.decorator'

@Controller('room')
@UseGuards(AuthGuard)
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  create(
    @CurrentUserId() userId: string,
    @Body() createRoomDto: CreateRoomDto
  ) {
    return this.roomService.create(userId, createRoomDto)
  }
}
