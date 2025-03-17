import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Score } from './entities/score.entity';
import { Model, PipelineStage } from 'mongoose';

interface ClassificationResult {
  subject: string;
  excellent: number;
  good: number;
  average: number;
  poor: number;
}

@Injectable()
export class ScoresService {
  constructor(
    @InjectModel(Score.name)
    private readonly scoreModel: Model<Score>,
  ) {}

  public async getScoreClassification() {
    const pipeline: PipelineStage[] = [
      {
        $group: {
          _id: '$subject',
          excellent: {
            $sum: { $cond: [{ $gte: ['$score', 8] }, 1, 0] },
          },
          good: {
            $sum: {
              $cond: [
                { $and: [{ $gte: ['$score', 6] }, { $lt: ['$score', 8] }] },
                1,
                0,
              ],
            },
          },
          average: {
            $sum: {
              $cond: [
                { $and: [{ $gte: ['$score', 4] }, { $lt: ['$score', 6] }] },
                1,
                0,
              ],
            },
          },
          poor: {
            $sum: { $cond: [{ $lt: ['$score', 4] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          subject: '$_id',
          excellent: 1,
          good: 1,
          average: 1,
          poor: 1,
        },
      },
    ];

    const result = await this.scoreModel
      .aggregate<ClassificationResult>(pipeline)
      .exec();

    return {
      classification: result,
    };
  }
}
