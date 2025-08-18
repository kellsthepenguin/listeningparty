import { IsNotEmpty } from 'class-validator'

export class JoinRoomDto {
  @IsNotEmpty()
  readonly id: string
}
