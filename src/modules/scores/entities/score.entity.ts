import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { Student } from 'src/modules/students/entities/student.entity';
import { Subject } from 'src/modules/subjects/entities/subject.entity';

@Schema()
export class Score extends Document {
  @ApiProperty({
    description: 'Student registration number',
  })
  @Prop({ type: Types.ObjectId, ref: 'Student', required: true })
  registrationNumber: Student;

  @ApiProperty({
    description: 'Subject name',
  })
  @Prop({ type: Types.ObjectId, ref: 'Subject', required: true })
  subject: Subject;

  @ApiProperty({
    description: 'Score',
  })
  @Prop({ required: true })
  score: number;
}

export const ScoreSchema = SchemaFactory.createForClass(Score);
