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
    await this.checkAndSeedDatabase();
  }

  private async checkAndSeedDatabase() {
    try {
      const studentCount = await this.studentModel.countDocuments().exec();
      if (studentCount === 0) {
        console.log('Database is empty, starting background seeding...');
        await this.seedDatabaseInBackground();
      } else {
        console.log(
          `Database already seeded with ${studentCount} students. Skipping seeding.`,
        );
      }
    } catch (error) {
      console.error('Error checking database or seeding:', error);
    }
  }

  private async seedDatabaseInBackground() {
    try {
      await this.studentSeeder.seed();
      console.log('Background seeding completed.');
    } catch (error) {
      console.error('Background seeding failed:', error);
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
    const report = {
      '>=8': {},
      '6-8': {},
      '4-6': {},
      '<4': {},
    };
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

    for (const subject of subjects) {
      report['>=8'][subject] = await this.studentModel
        .countDocuments({ [subject]: { $gte: 8 } })
        .exec();
      report['6-8'][subject] = await this.studentModel
        .countDocuments({ [subject]: { $gte: 6, $lt: 8 } })
        .exec();
      report['4-6'][subject] = await this.studentModel
        .countDocuments({ [subject]: { $gte: 4, $lt: 6 } })
        .exec();
      report['<4'][subject] = await this.studentModel
        .countDocuments({ [subject]: { $lt: 4 } })
        .exec();
    }

    return report;
  }

  async getTop10GroupA(): Promise<Student[]> {
    const topStudents: Student[] = (await this.studentModel
      .aggregate([
        {
          $match: {
            toan: { $exists: true },
            vat_li: { $exists: true },
            hoa_hoc: { $exists: true },
          },
        },
        {
          $addFields: {
            totalScore: { $add: ['$toan', '$vat_li', '$hoa_hoc'] },
          },
        },
        {
          $sort: { totalScore: -1 },
        },
        {
          $limit: 10,
        },
      ])
      .exec()) as Student[];

    return topStudents;
  }
}
