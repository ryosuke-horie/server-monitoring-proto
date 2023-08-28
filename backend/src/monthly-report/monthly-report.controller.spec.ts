import { Test, TestingModule } from '@nestjs/testing';
import { MonthlyReportController } from './monthly-report.controller';
import { MonthlyReportService } from './monthly-report.service';

describe('MonthlyReportController', () => {
  let controller: MonthlyReportController;
  let mockMonthlyReportService;

  beforeEach(async () => {
    mockMonthlyReportService = {
      getMonthlyReport: jest.fn(),
      getMonthlyTargetReport: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonthlyReportController],
      providers: [
        { provide: MonthlyReportService, useValue: mockMonthlyReportService },
      ],
    }).compile();

    controller = module.get<MonthlyReportController>(MonthlyReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMonthlyReport', () => {
    it('should call getMonthlyReport from monthlyReportService', async () => {
      const mockParamDate: string = '202308';
      await controller.getMonthlyReport(mockParamDate);
      expect(mockMonthlyReportService.getMonthlyReport).toHaveBeenCalledWith(
        mockParamDate,
      );
    });

    it('パラメータに文字列以外の値が与えられた場合、エラーがスローされる', async () => {
      // 数値が与えられた場合
      const mockParamDate: any = 202308;
      await expect(
        controller.getMonthlyReport(mockParamDate),
      ).rejects.toThrow();

      // 配列が与えられた場合
      const mockParamDate2: any = [202308];
      await expect(
        controller.getMonthlyReport(mockParamDate2),
      ).rejects.toThrow();
    });
  });
});
