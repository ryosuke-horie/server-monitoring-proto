import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Monitoring } from '../entities/monitoring.entity';
import { Repository } from 'typeorm';
import { CreateMonitoringDto } from './dto/create-monitoring.dto';
import { User } from '../entities/user.entity';
import { UpdateMonitoringDto } from './dto/update-monitoring.dto';

@Injectable()
export class MonitoringService {
  /**
   * コンストラクタ
   * @param monitoringRepository
   */
  constructor(
    @InjectRepository(Monitoring)
    private monitoringRepository: Repository<Monitoring>,
  ) {}

  /**
   * リクエストされた日の登録済みのデータを返す
   * @param date // 検索対象の日付 例:20230101
   * @returns Promise<Monitoring[]>
   */
  async find(date: string): Promise<Monitoring[]> {
    // 検索用に日付を整形する。例:20230101 → 2023/01/01
    const queryDate = date.replace(/(\d{4})(\d{2})(\d{2})/, '$1/$2/$3');

    // 検索対象の日付のデータを取得する
    const monitoring = await this.monitoringRepository.find({
      select: {
        target_name: true,
        is_backup_completed: true,
        is_not_alert: true,
        is_working: true,
      },
      where: { record_date: queryDate },
    });

    return monitoring;
  }

  /**
   * 監視記録を作成する
   * @param createMonitoringDto
   * @param user
   * @returns Promise<Monitoring>
   */
  async create(
    createMonitoringDto: CreateMonitoringDto,
    user: User,
  ): Promise<Monitoring> {
    const {
      target_name,
      target_ip,
      is_backup_completed,
      is_not_alert,
      is_working,
      record_date,
      created_at,
      updated_at,
    } = createMonitoringDto;

    const monitoring = this.monitoringRepository.create({
      target_name,
      target_ip,
      is_backup_completed,
      is_not_alert,
      is_working,
      record_date,
      created_at,
      updated_at,
      user,
    });

    await this.monitoringRepository.save(monitoring);

    return monitoring;
  }

  /**
   * 監視記録を更新する。
   * @param updateMonitoringDto
   * @param user
   * @returns Promise<Monitoring>
   * @throws NotFoundException // 更新対象のデータが見つからない場合にスローする
   */
  async update(
    updateMonitoringDto: UpdateMonitoringDto,
    user: User,
  ): Promise<Monitoring> {
    const {
      target_name,
      is_backup_completed,
      is_not_alert,
      is_working,
      record_date,
      updated_at,
    } = updateMonitoringDto;

    // 更新対象のデータを取得する
    const monitoring = await this.monitoringRepository.findOne({
      where: { target_name, record_date },
    });

    if (!monitoring) {
      throw new NotFoundException('対応する監視記録が見つかりません');
    }

    // 更新対象のデータを更新する
    monitoring.target_name = target_name;
    monitoring.is_backup_completed = is_backup_completed;
    monitoring.is_not_alert = is_not_alert;
    monitoring.is_working = is_working;
    monitoring.updated_at = updated_at;
    monitoring.user = user;
    monitoring.userId = user.id;

    // ここで更新する
    await this.monitoringRepository.save(monitoring);

    return monitoring;
  }
}
