import { Body, Controller, Post } from '@nestjs/common'
import { RoomService } from './room.service'
import { CreateRoomDto } from './dto'

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.create('', createRoomDto)
  }
}
