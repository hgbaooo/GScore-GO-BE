import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student } from './entities/student.entity';
import { StudentSeeder } from 'src/migrations/SeedStudents';

@Injectable()
export class StudentsService implements OnModuleInit {
  constructor(
    @InjectModel(Student.name) private readonly studentModel: Model<Student>,
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

  async findBySbd(sbd: string): Promise<Student> {
    const student = await this.studentModel.findOne({ sbd }).exec();
    if (!student) {
      throw new NotFoundException(`Student with SBD ${sbd} not found`);
    }
    return student;
  }

  async getScoreReport(): Promise<any> {
    const subjects = [
      'toan',
      'ngu_van',
      'ngoai_ngu',
      'vat_li',
      'hoa_hoc',
      'sinh_hoc',
      'lich_su',
      'dia_li',
      'gdcd',
    ];

    const pipeline = [
      {
        $facet: subjects.reduce((acc, subject) => {
          acc[subject] = [
            {
              $group: {
                _id: null,
                '>=8': {
                  $sum: { $cond: [{ $gte: [`$${subject}`, 8] }, 1, 0] },
                },
                '6-8': {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $gte: [`$${subject}`, 6] },
                          { $lt: [`$${subject}`, 8] },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                '4-6': {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $gte: [`$${subject}`, 4] },
                          { $lt: [`$${subject}`, 6] },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                '<4': { $sum: { $cond: [{ $lt: [`$${subject}`, 4] }, 1, 0] } },
              },
            },
            { $project: { _id: 0 } },
          ];
          return acc;
        }, {}),
      },
    ];

    const result = await this.studentModel
      .aggregate<{
        [key: string]: {
          '>=8': number;
          '6-8': number;
          '4-6': number;
          '<4': number;
        }[];
      }>(pipeline)
      .exec();
    const rawData = result[0];

    const formattedResult = {
      '>=8': {},
      '6-8': {},
      '4-6': {},
      '<4': {},
    };

    subjects.forEach((subject) => {
      if (rawData[subject] && rawData[subject].length > 0) {
        formattedResult['>=8'][subject] = rawData[subject][0]['>=8'] || 0;
        formattedResult['6-8'][subject] = rawData[subject][0]['6-8'] || 0;
        formattedResult['4-6'][subject] = rawData[subject][0]['4-6'] || 0;
        formattedResult['<4'][subject] = rawData[subject][0]['<4'] || 0;
      }
    });

    return formattedResult;
  }

  async getTop10GroupA(): Promise<Student[]> {
    return this.studentModel
      .aggregate<Student>([
        {
          $addFields: {
            totalScore: { $sum: ['$toan', '$vat_li', '$hoa_hoc'] },
          },
        },
        {
          $sort: { totalScore: -1 },
        },
        {
          $limit: 10,
        },
      ])
      .exec();
  }
}
