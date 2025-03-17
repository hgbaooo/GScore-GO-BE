import { Module } from '@nestjs/common';
import { ScoresService } from './scores.service';
import { ScoresController } from './scores.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ScoreSchema } from './entities/score.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Score', schema: ScoreSchema }]),
  ],
  controllers: [ScoresController],
  providers: [ScoresService],
  exports: [ScoresService, MongooseModule],
})
export class ScoreModule {}
