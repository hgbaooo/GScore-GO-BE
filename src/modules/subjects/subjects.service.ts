import { Injectable } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Subject } from './entities/subject.entity';
import { Model } from 'mongoose';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectModel(Subject.name)
    private readonly subjectModel: Model<Subject>,
  ) {}

  public async createSubject(createSubjectDto: CreateSubjectDto) {
    const newSubject = new this.subjectModel(createSubjectDto);
    return await newSubject.save();
  }

  public async getAllSubject() {
    return await this.subjectModel.find().exec();
  }

  public async getSubjectById(id: string) {
    return await this.subjectModel.findById(id).exec();
  }
}
