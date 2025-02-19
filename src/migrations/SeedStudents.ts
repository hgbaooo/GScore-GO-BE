import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student } from 'src/modules/students/entities/student.entity';
import { parseCsv } from 'src/utils/csv-parser.util';

@Injectable()
export class StudentSeeder {
  constructor(
    @InjectModel(Student.name) private readonly studentModel: Model<Student>,
  ) {}

  async seed() {
    try {
      const filePath = 'src/diem_thi_thpt_2024.csv';
      const rawData = await parseCsv(filePath);
      const batchSize = 10000;

      console.log(`Starting seeding of ${rawData.length} records...`);

      for (let i = 0; i < rawData.length; i += batchSize) {
        const batch = rawData.slice(i, i + batchSize);
        await this.studentModel.insertMany(batch, { ordered: false });
        console.log(
          `Inserted ${i + batch.length}/${rawData.length} records...`,
        );
      }

      console.log('Seeding complete.');
    } catch (error) {
      console.error('Seeding failed:', error);
      throw error;
    }
  }
}
