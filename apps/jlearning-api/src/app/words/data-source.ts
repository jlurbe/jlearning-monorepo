import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { JapaneseWord } from './entities/japanese-word.entity';
import { ExampleSentence } from './entities/example-sentence.entity';

export const dataSourceOptions: DataSourceOptions = {
  type: 'sqlite',
  database: 'jlearning.sqlite', // SQLite database file name
  synchronize: true, // Automatically create database schema on startup (for development)
  logging: false, // Set to true to see SQL queries in console
  entities: [JapaneseWord, ExampleSentence],
  migrations: [],
  subscribers: [],
};

export const AppDataSource = new DataSource(dataSourceOptions);
