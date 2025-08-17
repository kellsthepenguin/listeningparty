import { Injectable } from '@nestjs/common'
import { InjectRedis } from '@nestjs-modules/ioredis'
import Redis from 'ioredis'
import { CreateRoomDto } from './dto'
import { Room } from './room.interface'
import { JoinRoomDto } from './dto/join-room.dto'
import { WSService } from 'src/ws/ws.service'

@Injectable()
export class RoomService {
  private readonly roomPrefix = 'room:'
  private readonly userPrefix = 'user:'

  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly wsService: WSService
  ) {}

  private generateRoomId(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let id = ''
    for (let i = 0; i < 6; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return id
  }

  async create(ownerId: string, roomData: CreateRoomDto): Promise<Room | null> {
    let id: string
    let exists: boolean

    do {
      id = this.generateRoomId()
      exists = (await this.redis.exists(`${this.roomPrefix}:${id}`)) === 1
    } while (exists)

    const room: Room = {
      id,
      title: roomData.title,
      ownerId: ownerId,
      current: 0,
      users: [],
      playlist: []
    }

    try {
      this.redis.hset(`${this.roomPrefix}:${id}`, room)
      return room
    } catch (err) {
      return null
    }
  }

  async join(userId: string, roomData: JoinRoomDto): Promise<Room | null> {
    const roomId = roomData.id

    if (await this.redis.exists(`${this.roomPrefix}:${roomId}`)) {
      const server = this.wsService.getServer()
      const socket = server.sockets.sockets.get(userId)

      if (!socket) return null

      socket.rooms.add(roomId)

      this.redis.hset(`${this.userPrefix}:${userId}`, {
        currendRoomId: roomId
      })
      const strUsers = (await this.redis.hget(
        `${this.roomPrefix}:${roomId}`,
        'users'
      ))!
      let users

      try {
        users = JSON.parse(strUsers)
      } catch {
        users = []
      }

      users.push(userId)

      this.redis.hset(`${this.roomPrefix}:${roomId}`, {
        users: JSON.stringify(users)
      })

      return (await this.redis.hgetall(
        `${this.roomPrefix}:${roomId}`
      )) as any as Room
    } else {
      return null
    }
  }
}
