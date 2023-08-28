import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateMonitoringDto {
  @IsString()
  target_name: string;

  is_backup_completed: string;

  is_not_alert: string;

  is_working: string;

  @IsNotEmpty()
  @IsString()
  record_date: string;

  @IsString()
  @IsNotEmpty()
  updated_at: string;
}
