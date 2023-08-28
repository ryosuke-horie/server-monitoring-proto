import { User } from '../entities/user.entity';
import { AuthService } from './auth.service';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { CredentialsDto } from './dto/credentials.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guards';

/**
 * 認証用のコントローラー
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signup(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.authService.signUp(createUserDto);
  }

  @Post('/signin')
  async signin(
    @Body() credentialsDto: CredentialsDto,
  ): Promise<{ accessToken: string }> {
    return await this.authService.signIn(credentialsDto);
  }

  /**
   * トークンの検証
   * @returns
   */
  @Get('check-token')
  @UseGuards(JwtAuthGuard) // JWT認証ガードを使用
  checkToken() {
    return { valid: true }; // このエンドポイントにアクセスできた場合、トークンは有効
  }
}
