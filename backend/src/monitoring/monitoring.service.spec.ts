import { Test, TestingModule } from '@nestjs/testing';
import { MonitoringService } from './monitoring.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Monitoring } from '../entities/monitoring.entity';

describe('MonitoringService', () => {
  let service: MonitoringService;
  let mockMonitoringRepository;

  beforeEach(async () => {
    mockMonitoringRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn().mockImplementation((data) => data),
      save: jest.fn().mockImplementation((data) => Promise.resolve(data)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MonitoringService,
        {
          provide: getRepositoryToken(Monitoring),
          useValue: mockMonitoringRepository,
        },
      ],
    }).compile();

    service = module.get<MonitoringService>(MonitoringService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findメソッドの正常系テスト', async () => {
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

    // MonitoringRepositoryのfindメソッドは、mockMonitoringRecordを返すように設定
    mockMonitoringRepository.find.mockResolvedValue(mockMonitoringRecord);

    // テスト対象のメソッドを実行
    const result = await service.find('20210101');

    // モックの戻り値と、テスト対象のメソッドの戻り値が一致することを確認
    expect(result).toEqual(mockMonitoringRecord);
  });

  it('createメソッドの正常系テスト', async () => {
    const currentDate = new Date().toISOString(); // Date型をISO文字列に変換
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

    // モックユーザー
    const user = {
      id: 1,
      username: 'Test User',
      email: 'test@example.com',
      password: 'test1234',
      monitorings: [],
    };

    const result = await service.create(createMonitoringDto, user);

    // モックリポジトリのメソッドが呼び出されたか確認
    expect(mockMonitoringRepository.create).toBeCalledWith({
      ...createMonitoringDto,
      user,
    });
    expect(mockMonitoringRepository.save).toBeCalledWith(result);

    // 返り値が期待通りか確認
    expect(result).toEqual({ ...createMonitoringDto, user });
  });

  it('updateメソッドの正常系テスト', async () => {
    const currentDate = new Date().toISOString();
    const updateMonitoringDto = {
      target_name: 'Updated Name',
      is_backup_completed: 'true',
      is_not_alert: 'false',
      is_working: 'true',
      record_date: currentDate,
      updated_at: currentDate,
    };

    const user = {
      id: 1,
      username: 'Test User',
      email: 'test@example.com',
      password: 'test1234',
      monitorings: [],
    };

    const mockMonitoringRecord = {
      target_name: 'Original Name',
      is_backup_completed: 'false',
      is_not_alert: 'true',
      is_working: 'false',
      updated_at: new Date().toISOString(),
      user: user,
      userId: user.id,
    };

    mockMonitoringRepository.findOne.mockResolvedValue(mockMonitoringRecord);

    const result = await service.update(updateMonitoringDto, user);

    expect(mockMonitoringRepository.findOne).toBeCalledWith({
      where: {
        target_name: updateMonitoringDto.target_name,
        record_date: updateMonitoringDto.record_date,
      },
    });
    expect(mockMonitoringRepository.save).toBeCalledWith(result);
    expect(result.target_name).toEqual(updateMonitoringDto.target_name);
  });

  it('updateメソッドの異常系テスト', async () => {
    const currentDate = new Date().toISOString();
    const updateMonitoringDto = {
      target_name: 'NonExistent Name',
      is_backup_completed: 'true',
      is_not_alert: 'false',
      is_working: 'true',
      record_date: currentDate,
      updated_at: currentDate,
    };

    const user = {
      id: 1,
      username: 'Test User',
      email: 'test@example.com',
      password: 'test1234',
      monitorings: [],
    };

    mockMonitoringRepository.findOne.mockResolvedValue(null); // 対応する監視記録が存在しない場合

    await expect(service.update(updateMonitoringDto, user)).rejects.toThrow(
      '対応する監視記録が見つかりません',
    );
  });
});
