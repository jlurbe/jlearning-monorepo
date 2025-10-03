import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JapaneseWordsModule } from './japanese-words/japanese-words.module';
import { DatabaseService } from './common/database/database.service';

@Module({
  imports: [JapaneseWordsModule],
  controllers: [AppController],
  providers: [AppService, DatabaseService],
})
export class AppModule {}
