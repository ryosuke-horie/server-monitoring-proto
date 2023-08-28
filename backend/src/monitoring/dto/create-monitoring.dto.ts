import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMonitoringDto {
  @IsString()
  @IsNotEmpty()
  target_name: string;

  @IsString()
  @IsNotEmpty()
  target_ip: string;

  @IsNotEmpty()
  is_backup_completed: string;

  @IsNotEmpty()
  is_not_alert: string;

  @IsNotEmpty()
  is_working: string;

  @IsNotEmpty()
  @IsString()
  record_date: string;

  @IsString()
  @IsNotEmpty()
  created_at: string;

  @IsString()
  @IsNotEmpty()
  updated_at: string;
}
