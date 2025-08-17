import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async sign(id: string) {
    // pass socket id
    return this.jwtService.signAsync({ id })
  }
}
