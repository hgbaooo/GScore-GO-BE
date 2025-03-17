import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student } from './entities/student.entity';
import { StudentSeeder } from 'src/migrations/SeedStudents';
import { Score } from '../scores/entities/score.entity';

// Define interfaces for our data structures
export interface StudentScore {
  registrationNumber: string;
  totalScore: number;
  scores: Array<{
    subject: string;
    score: number;
  }>;
  subjectCount: number;
}

export interface TopStudentResult {
  _id: any;
  registrationNumber: string;
  foreignLanguageCode: string;
  totalScore: number;
  scores: Array<{
    subject: string;
    score: number;
  }>;
}

@Injectable()
export class StudentsService implements OnModuleInit {
  constructor(
    @InjectModel(Student.name) private readonly studentModel: Model<Student>,
    @InjectModel(Score.name) private readonly scoreModel: Model<Score>,
    private readonly studentSeeder: StudentSeeder,
  ) {}

  async onModuleInit() {
    try {
      const studentCount = await this.studentModel.countDocuments().exec();
      if (studentCount === 0) {
        console.log('Database is empty, starting seeding...');
        await this.studentSeeder.seed();
        console.log('Seeding completed.');
      } else {
        console.log(`Database already seeded with ${studentCount} students.`);
      }
    } catch (error) {
      console.error('Error checking database or seeding:', error);
    }
  }

  async findByRegistrationNumber(registrationNumber: string): Promise<any> {
    try {
      const student = await this.studentModel
        .findOne({ registrationNumber })
        .exec();

      if (!student) {
        throw new NotFoundException(
          `Student with registration number ${registrationNumber} not found`,
        );
      }

      // Get scores for this student
      const scores = await this.scoreModel
        .find({ registrationNumber })
        .select('subject score -_id')
        .exec();

      // Return student with scores
      return {
        _id: student._id,
        registrationNumber: student.registrationNumber,
        foreignLanguageCode: student.foreignLanguageCode,
        scores: scores || [],
      };
    } catch (error) {
      console.error(
        `Error finding student by registration number: ${registrationNumber}`,
        error,
      );
      throw error;
    }
  }

  async getTop10GroupA(): Promise<TopStudentResult[]> {
    const groupASubjects = ['toan', 'vat_li', 'hoa_hoc'];

    try {
      // Step 1: Get all scores for Group A subjects
      interface GroupAScore {
        registrationNumber: string;
        subject: string;
        score: number;
      }

      const groupAScores = (await this.scoreModel
        .find({ subject: { $in: groupASubjects } })
        .select('registrationNumber subject score')
        .lean()
        .exec()) as unknown as GroupAScore[];

      // Step 2: Process the scores in memory to calculate totals
      const studentScores: Record<string, StudentScore> = {};

      for (const score of groupAScores) {
        const { registrationNumber, subject, score: scoreValue } = score;

        if (!studentScores[registrationNumber]) {
          studentScores[registrationNumber] = {
            registrationNumber,
            totalScore: 0,
            scores: [],
            subjectCount: 0,
          };
        }

        studentScores[registrationNumber].totalScore += scoreValue;
        studentScores[registrationNumber].scores.push({
          subject,
          score: scoreValue,
        });
        studentScores[registrationNumber].subjectCount += 1;
      }

      // Step 3: Filter students with all three subjects
      const studentsWithAllSubjects: StudentScore[] = Object.values(
        studentScores,
      ).filter((student) => student.subjectCount === 3);

      // Step 4: Sort by total score and get top 10
      const top10Students = studentsWithAllSubjects
        .sort((a, b) => b.totalScore - a.totalScore)
        .slice(0, 10);

      // Step 5: Get student details for top 10
      const results: TopStudentResult[] = [];

      for (const student of top10Students) {
        const studentDetails = await this.studentModel
          .findOne({ registrationNumber: student.registrationNumber })
          .select('_id registrationNumber foreignLanguageCode')
          .lean()
          .exec();

        if (studentDetails) {
          results.push({
            _id: studentDetails._id,
            registrationNumber: studentDetails.registrationNumber,
            foreignLanguageCode: studentDetails.foreignLanguageCode,
            totalScore: student.totalScore,
            scores: student.scores,
          });
        }
      }

      return results;
    } catch (error) {
      console.error('Error in getTop10GroupA:', error);
      throw error;
    }
  }
}
