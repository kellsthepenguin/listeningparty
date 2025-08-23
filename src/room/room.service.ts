import { Injectable } from '@nestjs/common'
import { InjectRedis } from '@nestjs-modules/ioredis'
import Redis from 'ioredis'
import { CreateRoomDto } from './dto'
import { Room } from './room.interface'
import { JoinRoomDto } from './dto/join-room.dto'
import { WSService } from 'src/ws/ws.service'
import { AddToQueueDto } from './dto/add-to-queue.dto'

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

  async join(userId: string, roomData: JoinRoomDto): Promise<boolean> {
    const roomId = roomData.id

    if (await this.redis.exists(`${this.roomPrefix}:${roomId}`)) {
      const server = this.wsService.getServer()
      const socket = server.sockets.sockets.get(userId)

      if (!socket) return false

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

      socket.emit(
        'roomInfo',
        await this.redis.hgetall(`${this.roomPrefix}:${roomId}`)
      )
      server.to(roomId).emit('newUser', userId)
      socket.join(roomId)

      return true
    } else {
      return false
    }
  }

  async addToQueue(userId: string, data: AddToQueueDto) {
    const partialRoom = await this.redis.hmget(
      `${this.roomPrefix}:${data.roomId}`,
      'ownerId',
      'playlist'
    )
    const ownerId = partialRoom[0]!
    const playlist = JSON.parse(partialRoom[1]!) as Array<string>
    const server = this.wsService.getServer()

    if (ownerId !== userId) {
      return false
    }

    playlist.push(data.songId)

    await this.redis.hset(
      `${this.roomPrefix}:${data.roomId}`,
      'playlist',
      JSON.stringify(playlist)
    )

    server.to(data.roomId).emit('addSong', data.songId)

    return true
  }
}
