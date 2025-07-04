import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TimeModule } from './time/time.module';

@Module({
  imports: [TimeModule],
  controllers: [AppController],
})
export class AppModule {}
