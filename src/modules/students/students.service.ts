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
      // First, find the students who have all three subjects
      interface QualifyingStudent {
        _id: string;
      }

      const studentsWithAllSubjects = await this.scoreModel
        .aggregate<QualifyingStudent>([
          { $match: { subject: { $in: groupASubjects } } },
          {
            $group: {
              _id: '$registrationNumber',
              subjectCount: { $sum: 1 },
              subjects: { $push: '$subject' },
            },
          },
          { $match: { subjectCount: 3 } },
          { $project: { _id: 1 } },
        ])
        .allowDiskUse(true)
        .exec();

      // Get the registration numbers of qualifying students
      const qualifyingRegNums = studentsWithAllSubjects.map(
        (student) => student._id,
      );

      if (qualifyingRegNums.length === 0) {
        return [];
      }

      // Now perform the main aggregation only on these students
      const results = await this.scoreModel
        .aggregate([
          // Match only qualifying students and Group A subjects
          {
            $match: {
              registrationNumber: { $in: qualifyingRegNums },
              subject: { $in: groupASubjects },
            },
          },

          // Group by registration number and calculate total score
          {
            $group: {
              _id: '$registrationNumber',
              totalScore: { $sum: '$score' },
              scores: {
                $push: {
                  subject: '$subject',
                  score: '$score',
                },
              },
            },
          },

          // Sort by total score
          { $sort: { totalScore: -1 } },

          // Limit to top 10
          { $limit: 10 },

          // Lookup student details
          {
            $lookup: {
              from: 'students',
              localField: '_id',
              foreignField: 'registrationNumber',
              as: 'studentDetails',
            },
          },

          // Unwind student details
          { $unwind: '$studentDetails' },

          // Project final result
          {
            $project: {
              _id: '$studentDetails._id',
              registrationNumber: '$_id',
              foreignLanguageCode: '$studentDetails.foreignLanguageCode',
              totalScore: 1,
              scores: 1,
            },
          },
        ])
        .allowDiskUse(true)
        .exec();

      return results as TopStudentResult[];
    } catch (error) {
      console.error('Error in getTop10GroupA:', error);
      throw error;
    }
  }
}
