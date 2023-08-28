import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
  synchronize: false,
  logging: false,
  entities: ['src/entities/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migrations_history',
  subscribers: [],
});

// https://www.npmjs.com/package/typeorm?activeTab=readme
AppDataSource.initialize()
  .then(() => {
    console.log('データソースを読み込みました。');
  })
  .catch((error) => console.log(error));
