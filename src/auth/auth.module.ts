import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from './auth.service'
import { readFileSync } from 'fs'
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard } from './auth.guard'

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: readFileSync('./secret.txt')
    })
  ],
  controllers: [],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    }
  ],
  exports: [AuthService]
})
export class AuthModule {}
