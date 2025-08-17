import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    const authorization = request.headers.authorization

    if (authorization) {
      const [scheme, token] = authorization.split(' ')
      if (scheme.toLowerCase() !== 'bearer') return false
      try {
        const { id } = await this.jwtService.verifyAsync(token)
        request.userId = id
        return true
      } catch {
        return false
      }
    }

    throw new BadRequestException()
  }
}
