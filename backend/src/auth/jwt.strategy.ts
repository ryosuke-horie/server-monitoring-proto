import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Bearerトークンを取得
      ignoreExpiration: false, // 期限切れのトークンを拒否
      secretOrKey: 'secret', // 秘密鍵
    });
  }

  async validate(payload: { id: number; username: string }): Promise<User> {
    const { id, username } = payload;
    const user = await this.userRepository.findOne({ where: { id, username } });

    // 認証に成功した場合はユーザー情報を返す
    if (user) {
      return user;
    }
    throw new UnauthorizedException();
  }
}
