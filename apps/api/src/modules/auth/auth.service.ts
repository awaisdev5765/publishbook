import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { UserRole } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '../../prisma/prisma.service'
import type { RegisterDto } from './dto/register.dto'
import type { LoginDto } from './dto/login.dto'
import type { JwtPayload } from './types/jwt-payload.interface'

const SAFE_USER_SELECT = {
  id: true, name: true, email: true, role: true, avatarUrl: true,
} as const

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma:         PrismaService,
    private readonly jwtService:     JwtService,
    private readonly configService:  ConfigService,
  ) {}

  // ─── Public methods ───────────────────────────────────────────────────────

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } })
    if (existing) throw new ConflictException('An account with this email already exists')

    const passwordHash = await bcrypt.hash(dto.password, 10)
    const user = await this.prisma.user.create({
      data:   { name: dto.name, email: dto.email, passwordHash },
      select: SAFE_USER_SELECT,
    })

    const { accessToken, refreshToken } = await this.generateTokenPair(user.id, user.email, user.role)
    return { accessToken, refreshToken, user }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } })
    if (!user) throw new UnauthorizedException('Invalid email or password')

    const valid = await bcrypt.compare(dto.password, user.passwordHash)
    if (!valid) throw new UnauthorizedException('Invalid email or password')

    const safeUser = await this.prisma.user.findUniqueOrThrow({
      where: { id: user.id }, select: SAFE_USER_SELECT,
    })
    const { accessToken, refreshToken } = await this.generateTokenPair(user.id, user.email, user.role)
    return { accessToken, refreshToken, user: safeUser }
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      })
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub }, select: SAFE_USER_SELECT,
      })
      if (!user) throw new Error('User not found')

      const accessToken = await this.signAccessToken(user.id, user.email, user.role)
      return { accessToken, user }
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token')
    }
  }

  // ─── Private helpers ──────────────────────────────────────────────────────

  private async generateTokenPair(userId: string, email: string, role: UserRole) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(userId, email, role),
      this.jwtService.signAsync(
        { sub: userId, email, role } satisfies Omit<JwtPayload, 'iat' | 'exp'>,
        {
          secret:     this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
          expiresIn:  this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d'),
        },
      ),
    ])
    return { accessToken, refreshToken }
  }

  private signAccessToken(userId: string, email: string, role: UserRole) {
    return this.jwtService.signAsync(
      { sub: userId, email, role } satisfies Omit<JwtPayload, 'iat' | 'exp'>,
      {
        secret:    this.configService.getOrThrow<string>('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRES_IN', '15m'),
      },
    )
  }
}
