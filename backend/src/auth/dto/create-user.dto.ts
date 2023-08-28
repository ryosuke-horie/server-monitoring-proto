import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

/**
 * ユーザー作成時のDTO
 */
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password: string;

  @IsString()
  @IsNotEmpty()
  email: string;
}
