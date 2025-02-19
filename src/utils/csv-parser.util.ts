import * as csv from 'csv-parser';
import * as fs from 'fs';
import { CreateStudentDto } from 'src/modules/students/dtos/create-student.dto';

export async function parseCsv(filePath: string): Promise<CreateStudentDto[]> {
  return new Promise((resolve, reject) => {
    const results: CreateStudentDto[] = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data: { [key: string]: string }) => {
        const student: CreateStudentDto = {
          sbd: data.sbd,
          toan: data.toan ? parseFloat(data.toan) : undefined,
          ngu_van: data.ngu_van ? parseFloat(data.ngu_van) : undefined,
          ngoai_ngu: data.ngoai_ngu ? parseFloat(data.ngoai_ngu) : undefined,
          vat_li: data.vat_li ? parseFloat(data.vat_li) : undefined,
          hoa_hoc: data.hoa_hoc ? parseFloat(data.hoa_hoc) : undefined,
          sinh_hoc: data.sinh_hoc ? parseFloat(data.sinh_hoc) : undefined,
          lich_su: data.lich_su ? parseFloat(data.lich_su) : undefined,
          dia_li: data.dia_li ? parseFloat(data.dia_li) : undefined,
          gdcd: data.gdcd ? parseFloat(data.gdcd) : undefined,
          ma_ngoai_ngu: data.ma_ngoai_ngu,
        };
        results.push(student);
      })
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}
