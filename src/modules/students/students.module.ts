import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { Student, StudentSchema } from './entities/student.entity';
import { StudentSeeder } from 'src/migrations/SeedStudents';
import { SubjectModule } from '../subjects/subjects.module';
import { ScoreModule } from '../scores/scores.module';
import { Score, ScoreSchema } from '../scores/entities/score.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Student.name, schema: StudentSchema },
      { name: Score.name, schema: ScoreSchema },
    ]),
    SubjectModule,
    ScoreModule,
  ],

  controllers: [StudentsController],
  providers: [StudentsService, StudentSeeder],
})
export class StudentsModule {}
