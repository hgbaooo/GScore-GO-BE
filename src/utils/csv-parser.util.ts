import * as csv from 'csv-parser';
import * as fs from 'fs';
import { CreateScoreDto } from 'src/modules/scores/dto/create-score.dto';
import { CreateStudentDto } from 'src/modules/students/dtos/create-student.dto';
import { CreateSubjectDto } from 'src/modules/subjects/dto/create-subject.dto';

interface ParsedCsv {
  students: CreateStudentDto[];
  scores: CreateScoreDto[];
  subjects: CreateSubjectDto[];
}

export async function parseCsv(filePath: string): Promise<ParsedCsv> {
  return new Promise((resolve, reject) => {
    const results: ParsedCsv = {
      students: [],
      scores: [],
      subjects: [],
    };
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data: { [key: string]: string }) => {
        const student: CreateStudentDto = {
          registrationNumber: data.sbd,
          foreignLanguageCode: data.ma_ngoai_ngu,
        };
        results.students.push(student);

        const scoreFields = [
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
        scoreFields.forEach((subject) => {
          if (data[subject]) {
            results.scores.push({
              registrationNumber: data.sbd,
              subject: subject,
              score: parseFloat(data[subject]),
            });
          }
        });

        scoreFields.forEach((subject) => {
          if (!results.subjects.some((s) => s.name === subject)) {
            results.subjects.push({ name: subject });
          }
        });
      })
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}
