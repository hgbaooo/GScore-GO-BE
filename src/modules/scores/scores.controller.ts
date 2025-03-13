import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ScoresService } from './scores.service';
import { CreateScoreDto } from './dto/create-score.dto';

@Controller('scores')
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  @Post()
  createScore(@Body() createScoreDto: CreateScoreDto) {
    return this.scoresService.create(createScoreDto);
  }

  @Get()
  getAllScore() {
    return this.scoresService.getAllScore();
  }

  @Get(':studentId')
  getScoreByStudentId(@Param('studentId') studentId: string) {
    return this.scoresService.getScoreByStudentId(studentId);
  }
}
