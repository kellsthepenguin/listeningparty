import { IsNotEmpty } from 'class-validator'

export class AddToQueueDto {
  @IsNotEmpty()
  readonly roomId: string

  @IsNotEmpty()
  readonly songId: string
}
