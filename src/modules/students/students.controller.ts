import { Controller, Get } from '@nestjs/common';
import { StudentsService } from './students.service';
import { Student } from './entities/student.entity';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';

@ApiTags('students')
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  // @Get('find')
  // @ApiOperation({ summary: 'Find a student by registration number (SBD)' })
  // @ApiQuery({
  //   name: 'sbd',
  //   type: String,
  //   description: 'Student registration number',
  // })
  // @ApiOkResponse({ description: 'The student record', type: Student })
  // @ApiResponse({ status: 404, description: 'Student not found' })
  // @UsePipes(new ValidationPipe({ transform: true }))
  // async findBySbd(@Query() query: FindBySbdDto): Promise<Student> {
  //   return this.studentsService.findBySbd(query.sbd);
  // }

  @Get('report')
  @ApiOperation({ summary: 'Get score report' })
  @ApiOkResponse({ description: 'The score report of student' })
  async getScoreReport(): Promise<any> {
    return this.studentsService.getScoreReport();
  }

  @Get('top10-groupA')
  @ApiOperation({ summary: 'Get top 10 students in group A' })
  @ApiOkResponse({ description: 'Top 10 student group A', type: [Student] })
  async getTop10GroupA(): Promise<Student[]> {
    return this.studentsService.getTop10GroupA();
  }
}
