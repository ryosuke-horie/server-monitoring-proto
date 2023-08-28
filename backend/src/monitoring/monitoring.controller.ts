import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MonitoringService } from './monitoring.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guards';
import { GetUser } from './decorators/monitoring.decorator';
import { CreateMonitoringDto } from './dto/create-monitoring.dto';
import { UpdateMonitoringDto } from './dto/update-monitoring.dto';
import { User } from '../entities/user.entity';
import { Monitoring } from '../entities/monitoring.entity';

@Controller('monitoring')
@UseInterceptors(ClassSerializerInterceptor) // responseを返す前にpasswordを除外する
@UseGuards(JwtAuthGuard)
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

  /**
   * リクエストされた日の登録済みのデータを返す
   * @param date // 検索対象の日付 例:20230101
   * @returns Promise<Monitoring[]>
   * @throws Error // クエリパラメータがない場合は例外をスローする
   */
  @Get()
  async find(@Query('date') date: string): Promise<Monitoring[]> {
    // クエリパラメータがない場合は例外をスローする
    if (!date) {
      throw new Error('date is required');
    }

    return await this.monitoringService.find(date);
  }

  /**
   * 登録済みのデータを作成する
   * @param createMonitoringDto
   * @param user
   * @returns
   */
  @Post()
  async create(
    @Body() createMonitoringDto: CreateMonitoringDto,
    @GetUser() user: User,
  ): Promise<Monitoring> {
    return await this.monitoringService.create(createMonitoringDto, user);
  }

  /**
   * 登録済みのデータを更新する
   * @param upateMonitoringDto
   * @param user
   * @returns
   */
  @Patch()
  async update(
    @Body() upateMonitoringDto: UpdateMonitoringDto,
    @GetUser() user: User,
  ): Promise<Monitoring> {
    return await this.monitoringService.update(upateMonitoringDto, user);
  }
}
