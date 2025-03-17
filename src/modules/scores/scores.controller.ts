import { Controller, Get } from '@nestjs/common';
import { ScoresService } from './scores.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('scores')
@Controller('scores')
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  @Get('classification')
  @ApiOperation({ summary: 'Get score classification into 4 levels' })
  @ApiResponse({ status: 200, description: 'Returns the score classification' })
  getScoreClassification(): Promise<any> {
    return this.scoresService.getScoreClassification();
  }
}
