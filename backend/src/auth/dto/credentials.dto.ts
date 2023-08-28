import { IsString, MaxLength, MinLength, IsNotEmpty } from 'class-validator';

/**
 * ユーザーの認証に必要な情報を格納するDTO
 */
export class CredentialsDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password: string;
}
