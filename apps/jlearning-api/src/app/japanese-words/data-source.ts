import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { JapaneseWordEntity } from '@jlearning-monorepo/api-common/contexts/japanese-words/infrastructure/entities/japanese-word.entity';

export const dataSourceOptions: DataSourceOptions = {
  type: 'sqlite',
  database: 'jlearning.sqlite', // SQLite database file name
  synchronize: true, // Automatically create database schema on startup (for development)
  logging: false, // Set to true to see SQL queries in console
  entities: [JapaneseWordEntity],
  migrations: [],
  subscribers: [],
};

export const AppDataSource = new DataSource(dataSourceOptions);
