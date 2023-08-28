import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from '../entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { CredentialsDto } from './dto/credentials.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UnauthorizedException } from '@nestjs/common';

const userRepositoryMock = {
  create: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
};

const jwtServiceMock = {
  sign: jest.fn().mockReturnValue('token'),
  verify: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepositoryMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('signUp', () => {
    it('should return a user', async () => {
      // モックのデータ
      const mockUser = {
        id: 1,
        username: 'test-user-2',
        password:
          '$2b$10$mFsMKsar34Mr2jWR5bFYNecvuZoQUfHV0/AFCCGW3lx6Z9GqAOCz6',
        email: 'example@gmail.com',
      };

      // モックのデータを返すように設定
      userRepositoryMock.create.mockReturnValue(mockUser);
      userRepositoryMock.save.mockResolvedValue(mockUser);

      // テスト用のデータ
      const createUserDto: CreateUserDto = {
        username: 'test-user',
        password: 'test1234',
        email: 'example@gmail.com',
      };

      // テスト用のデータを引数に渡して実行
      const result = await service.signUp(createUserDto);

      // モックのデータと一致するか確認
      expect(result).toEqual(mockUser);
    });
  });

  describe('signIn', () => {
    it('should return a token', async () => {
      // モックのデータ
      const mockUser = {
        id: 1,
        username: 'test-user-2',
        password:
          '$2b$10$mFsMKsar34Mr2jWR5bFYNecvuZoQUfHV0/AFCCGW3lx6Z9GqAOCz6',
        email: 'example@gmail.com',
      };

      // モックのデータを返すように設定
      userRepositoryMock.findOne.mockResolvedValue(mockUser);

      // テスト用のデータ
      const credentialsDto: CredentialsDto = {
        email: 'example@gmail.com',
        password: 'test1234',
      };

      // テスト用のデータを引数に渡して実行
      const result = await service.signIn(credentialsDto);

      // モックのデータと一致するか確認
      expect(result.accessToken).toEqual('token');
    });

    it('should throw an error as user is not found', async () => {
      // モックのデータを返すように設定
      userRepositoryMock.findOne.mockResolvedValue(null);

      // テスト用のデータ
      const credentialsDto: CredentialsDto = {
        email: 'example@gmail.com',
        password: 'testpassword',
      };

      // テスト用のデータを引数に渡して実行
      expect(service.signIn(credentialsDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw an error as the password is wrong', async () => {
      // モックのデータ
      const mockUser = {
        id: 1,
        username: 'test-user-2',
        password:
          '$2b$10$mFsMKsar34Mr2jWR5bFYNecvuZoQUfHV0/AFCCGW3lx6Z9GqAOCz6',
        email: 'example@gmail.com',
      };

      // モックのデータを返すように設定
      userRepositoryMock.findOne.mockResolvedValue(mockUser);

      // テスト用のデータ
      const credentialsDto: CredentialsDto = {
        email: 'example@gmail.com',
        password: 'wrongtestpassword',
      };

      // テスト用のデータを引数に渡して実行
      expect(service.signIn(credentialsDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
