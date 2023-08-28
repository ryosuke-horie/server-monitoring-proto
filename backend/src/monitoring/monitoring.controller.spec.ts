import { Test, TestingModule } from '@nestjs/testing';
import { MonitoringController } from './monitoring.controller';
import { MonitoringService } from './monitoring.service';
import { User } from 'src/entities/user.entity';

describe('MonitoringController', () => {
  let controller: MonitoringController;
  let mockMonitoringService;

  beforeEach(async () => {
    mockMonitoringService = {
      find: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonitoringController],
      providers: [
        { provide: MonitoringService, useValue: mockMonitoringService },
      ],
    }).compile();

    controller = module.get<MonitoringController>(MonitoringController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('find', () => {
    // 正常系：クエリパラメータに日付を指定してリクエストした場合のうち、対象のデータがある場合のテスト
    it('should return monitoring records', async () => {
      // モックの戻り値を設定
      const mockMonitoringRecord = [
        {
          target_name: 'サンプルサイト1',
          is_backup_completed: 'true',
          is_not_alert: 'true',
          is_working: 'true',
        },
        {
          target_name: 'サンプルサイト2',
          is_backup_completed: 'true',
          is_not_alert: 'true',
          is_working: 'true',
        },
      ];

      // MonitoringServiceのfindメソッドは、mockMonitoringRecordを返すように設定
      mockMonitoringService.find.mockResolvedValue(mockMonitoringRecord);

      // テスト対象のメソッドを実行
      const result = await controller.find('20210101');

      // モックの戻り値と、テスト対象のメソッドの戻り値が一致することを確認
      expect(result).toEqual(mockMonitoringRecord);
    });

    // 正常系：クエリパラメータに日付を指定してリクエストした場合のうち、対象のデータがない場合のテスト
    it('should return empty array', async () => {
      // モックの戻り値を設定
      const mockMonitoringRecord = [];

      // MonitoringServiceのfindメソッドは、mockMonitoringRecordを返すように設定
      mockMonitoringService.find.mockResolvedValue(mockMonitoringRecord);

      // テスト対象のメソッドを実行
      const result = await controller.find('20210101');

      // モックの戻り値と、テスト対象のメソッドの戻り値が一致することを確認
      expect(result).toEqual(mockMonitoringRecord);
    });

    // 異常系：クエリパラメータに日付を指定せずにリクエストした場合のテスト
    it('should throw an error', async () => {
      // テスト対象のメソッドを実行
      const result = controller.find('');

      // 例外がスローされることを確認
      await expect(result).rejects.toThrowError('date is required');
    });
  });

  describe('create', () => {
    it('should create a monitoring record and return it', async () => {
      const currentDate = new Date().toISOString(); // Date型をISO文字列に変換

      const mockMonitoringRecord = {
        id: 1,
        target_name: 'Test Name',
        target_ip: '127.0.0.1',
        is_backup_completed: 'true',
        is_not_alert: 'false',
        is_working: 'true',
        record_date: currentDate,
        created_at: currentDate,
        updated_at: currentDate,
      };
      mockMonitoringService.create.mockResolvedValue(mockMonitoringRecord);

      const createMonitoringDto = {
        target_name: 'Test Name',
        target_ip: '127.0.0.1',
        is_backup_completed: 'true',
        is_not_alert: 'false',
        is_working: 'true',
        record_date: currentDate,
        created_at: currentDate,
        updated_at: currentDate,
      };

      const user = {
        id: 1,
        username: 'Test User',
        email: 'test@example.com',
        password: 'test1234',
        monitorings: [],
      };

      const result = await controller.create(createMonitoringDto, user);

      expect(mockMonitoringService.create).toHaveBeenCalledWith(
        createMonitoringDto,
        user,
      );
      expect(result).toEqual(mockMonitoringRecord);
    });
  });

  describe('update', () => {
    // 正常系のテスト
    it('updateメソッドを利用する', async () => {
      // 戻り値のモックデータを設定
      const mockMonitoringRecord = {
        id: 1,
        target_name: 'サンプルサイト1',
        is_backup_completed: 'true',
        is_not_alert: 'true',
        is_working: 'true',
        record_date: '2023/08/10',
        created_at: '2023/08/10',
        updated_at: '2023/08/10',
        user: {
          id: 1,
          username: 'Test User',
          email: 'example@gmail.com',
          password: 'hashedPassword',
        },
      };

      // モックの戻り値を設定
      mockMonitoringService.update.mockResolvedValue(mockMonitoringRecord);

      // Patchメソッドでリクエストされたデータを設定
      const mockUpdateMonitoringDto = {
        target_name: 'サンプルサイト1',
        is_backup_completed: 'true',
        is_not_alert: 'true',
        is_working: 'true',
        record_date: '2023/08/10',
        updated_at: '2023/08/10',
      };

      // モックユーザー
      const mockUser: User = {
        id: 1,
        username: 'Test User',
        email: 'example@gmail.com',
        password: 'hashedPassword',
        monitorings: [],
      };

      // テスト対象にリクエストを送信
      const result = await controller.update(mockUpdateMonitoringDto, mockUser);

      // service層のupdateメソッドが呼び出されたことを確認
      expect(mockMonitoringService.update).toHaveBeenCalledWith(
        mockUpdateMonitoringDto,
        mockUser,
      );

      // モックの戻り値と、テスト対象のメソッドの戻り値が一致することを確認
      expect(result).toEqual(mockMonitoringRecord);
    });
  });
});
