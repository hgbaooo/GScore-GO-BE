import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student } from 'src/modules/students/entities/student.entity';
import { parseCsv } from 'src/utils/csv-parser.util';
import { Subject } from 'src/modules/subjects/entities/subject.entity';
import { Score } from 'src/modules/scores/entities/score.entity';
import { CreateStudentDto } from 'src/modules/students/dtos/create-student.dto';
import { CreateScoreDto } from 'src/modules/scores/dto/create-score.dto';
import { CreateSubjectDto } from 'src/modules/subjects/dto/create-subject.dto';

@Injectable()
export class StudentSeeder {
  private readonly filePath = 'src/diem_thi_thpt_2024.csv';
  private readonly batchSize = 10000;

  constructor(
    @InjectModel(Student.name) private readonly studentModel: Model<Student>,
    @InjectModel(Subject.name) private readonly subjectModel: Model<Subject>,
    @InjectModel(Score.name) private readonly scoreModel: Model<Score>,
  ) {}

  async seed() {
    try {
      console.time('Seeding Time');
      console.log(`[${new Date().toISOString()}] Starting seeding process...`);

      const { students, scores, subjects } = (await parseCsv(
        this.filePath,
      )) as {
        students: CreateStudentDto[];
        scores: CreateScoreDto[];
        subjects: CreateSubjectDto[];
      };

      console.log(
        `Parsed ${students.length} students, ${scores.length} scores, and ${subjects.length} subjects.`,
      );

      await Promise.all(
        subjects.map((subject) =>
          this.subjectModel.updateOne({ name: subject.name }, subject, {
            upsert: true,
          }),
        ),
      );
      console.log(`Subjects inserted/updated.`);

      for (let i = 0; i < students.length; i += this.batchSize) {
        const studentBatch = students.slice(i, i + this.batchSize);

        try {
          await this.studentModel.insertMany(studentBatch, { ordered: false });
          console.log(
            `[${new Date().toISOString()}] Inserted ${i + studentBatch.length}/${students.length} students.`,
          );
        } catch (batchError) {
          console.error(
            `Error inserting student batch ${i / this.batchSize + 1}:`,
            batchError,
          );
        }
      }

      for (let i = 0; i < scores.length; i += this.batchSize) {
        const scoreBatch = scores.slice(i, i + this.batchSize);

        try {
          await this.scoreModel.insertMany(scoreBatch, { ordered: false });
          console.log(
            `[${new Date().toISOString()}] Inserted ${i + scoreBatch.length}/${scores.length} scores.`,
          );
        } catch (batchError) {
          console.error(
            `Error inserting score batch ${i / this.batchSize + 1}:`,
            batchError,
          );
        }
      }

      console.log('Seeding complete.');
      console.timeEnd('Seeding Time');
    } catch (error) {
      console.error('Seeding failed:', error);
      throw error;
    }
  }
}
