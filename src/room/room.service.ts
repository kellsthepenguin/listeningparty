import { Injectable } from '@nestjs/common'
import { InjectRedis } from '@nestjs-modules/ioredis'
import Redis from 'ioredis'
import { CreateRoomDto } from './dto'
import { Room } from './room.interface'

@Injectable()
export class RoomService {
  private readonly roomPrefix = 'room:'

  constructor(@InjectRedis() private readonly redis: Redis) {}

  private generateRoomId(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let id = ''
    for (let i = 0; i < 6; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return id
  }

  async create(ownerId: string, roomData: CreateRoomDto): Promise<boolean> {
    let id: string
    let exists: boolean

    do {
      id = this.generateRoomId()
      exists = (await this.redis.exists(`${this.roomPrefix}${id}`)) === 1
    } while (exists)

    const room: Room = {
      id,
      title: roomData.title,
      ownerId: ownerId,
      current: 0,
      playlist: []
    }
    try {
      this.redis.hset(`${this.roomPrefix}${id}`, room)
      return true
    } catch (err) {
      return false
    }
  }
}
