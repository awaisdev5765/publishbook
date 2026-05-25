import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common'
import type { Request, Response } from 'express'
import { AuthService } from './auth.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto }    from './dto/login.dto'
import { Public }      from '../../common/decorators/public.decorator'
import { CurrentUser } from '../../common/decorators/current-user.decorator'

const REFRESH_COOKIE = 'refresh_token'

const cookieOpts = (maxAge: number) => ({
  httpOnly: true,
  secure:   process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge,
  path: '/',
})

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** Register a new account */
  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, ...data } = await this.authService.register(dto)
    res.cookie(REFRESH_COOKIE, refreshToken, cookieOpts(7 * 24 * 60 * 60 * 1000))
    return data // { accessToken, user }
  }

  /** Sign in with email + password */
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, ...data } = await this.authService.login(dto)
    res.cookie(REFRESH_COOKIE, refreshToken, cookieOpts(7 * 24 * 60 * 60 * 1000))
    return data // { accessToken, user }
  }

  /** Exchange refresh-token cookie for a new access token */
  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request) {
    const token = req.cookies?.[REFRESH_COOKIE] as string | undefined
    if (!token) throw new UnauthorizedException('No refresh token')
    return this.authService.refreshAccessToken(token) // { accessToken, user }
  }

  /** Clear the refresh-token cookie */
  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(REFRESH_COOKIE, cookieOpts(0))
    return { success: true }
  }

  /** Return the currently authenticated user */
  @Get('me')
  me(@CurrentUser() user: Express.User) {
    return user
  }
}
