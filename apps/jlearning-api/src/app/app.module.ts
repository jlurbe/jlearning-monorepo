import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JapaneseWordsModule } from './japanese-words/japanese-words.module';
import { DatabaseService } from './common/database/database.service';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
  imports: [AuthModule, JapaneseWordsModule],
  controllers: [AppController],
  providers: [
    AppService,
    DatabaseService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
