import { Injectable } from '@nestjs/common';
import { CreateScoreDto } from './dto/create-score.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Score } from './entities/score.entity';
import { Model } from 'mongoose';

@Injectable()
export class ScoresService {
  constructor(
    @InjectModel(Score.name)
    private readonly scoreModel: Model<Score>,
  ) {}
  public async create(createScoreDto: CreateScoreDto) {
    const newScore = new this.scoreModel(createScoreDto);
    return await newScore.save();
  }

  public async getAllScore() {
    return await this.scoreModel.find().exec();
  }

  public async getScoreByStudentId(studentId: string) {
    return await this.scoreModel.find({ student: studentId }).exec();
  }
}
