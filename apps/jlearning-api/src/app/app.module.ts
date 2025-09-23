import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WordsModule } from './words/words.module';
import { dataSourceOptions } from './words/data-source';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), WordsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
