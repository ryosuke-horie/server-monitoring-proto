import { Module } from '@nestjs/common';
import { MonthlyReportService } from './monthly-report.service';
import { MonthlyReportController } from './monthly-report.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Monitoring } from '../entities/monitoring.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Monitoring])],
  controllers: [MonthlyReportController],
  providers: [MonthlyReportService],
})
export class MonthlyReportModule {}
