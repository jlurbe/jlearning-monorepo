import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JapaneseWordsModule } from './japanese-words/japanese-words.module';
import { dataSourceOptions } from './common/data-source';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), JapaneseWordsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
