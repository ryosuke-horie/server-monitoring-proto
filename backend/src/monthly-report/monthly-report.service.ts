import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Monitoring } from '../entities/monitoring.entity';
import { Like, Repository, createQueryBuilder } from 'typeorm';
import { target_server_names } from './consts/target_server_name';

@Injectable()
export class MonthlyReportService {
  /**
   * コンストラクタ
   * @param monitoringRepository
   */
  constructor(
    @InjectRepository(Monitoring)
    private monitoringRepository: Repository<Monitoring>,
  ) {}

  /**
   * 下のgetMonthlyTargetReportをループして、一括で月次レポートを取得する
   * @param dateYear
   * @returns
   */
  async getMonthlyReport(dateYear: string) {
    // フロントへ返すオブジェクト：
    let resultsObject = {};

    // target_server_namesでループ：
    for (const target_server_name of target_server_names) {
      // 対象のサーバーの月報を取得しフロントへ返すオブジェクトに追加
      resultsObject[target_server_name] = await this.getMonthlyTargetReport(
        dateYear,
        target_server_name,
      );
    }

    return resultsObject;
  }

  /**
   * 指定したターゲットの月次レポートを取得する
   */
  async getMonthlyTargetReport(dateYear: string, target_name: string) {
    // dateYearは6桁のため,4文字目と5文字目の間に'/'を挿入する
    const record_date = dateYear.slice(0, 4) + '/' + dateYear.slice(4, 6);

    const monitoring = await this.monitoringRepository
      .createQueryBuilder('monitoring')
      .leftJoinAndSelect('monitoring.user', 'user')
      .where('monitoring.target_name = :target_name', {
        target_name: target_name,
      })
      .andWhere('monitoring.record_date like :record_date', {
        record_date: record_date + '%',
      })
      .select([
        'monitoring.is_backup_completed',
        'monitoring.is_not_alert',
        'monitoring.is_working',
        'monitoring.record_date',
        'user.username',
      ])
      .orderBy('monitoring.record_date', 'DESC')
      .getMany();

    return monitoring || [];
  }
}
