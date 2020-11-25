import { Module } from '@nestjs/common';
import { NewsService } from './services/news.service';
import { NewsController } from './controllers/news.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from 'src/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([News]),

  ],
  controllers: [NewsController],
  providers: [NewsService],
})
export class NewsModule {}
