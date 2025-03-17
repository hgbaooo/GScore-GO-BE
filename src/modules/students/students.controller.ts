import { Controller, Get, Param } from '@nestjs/common';
import { StudentsService, TopStudentResult } from './students.service';
import { Student } from './entities/student.entity';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('students')
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get('top10-groupA')
  @ApiOperation({ summary: 'Get top 10 students in group A' })
  @ApiOkResponse({ description: 'Top 10 student group A', type: [Student] })
  async getTop10GroupA(): Promise<TopStudentResult[]> {
    return this.studentsService.getTop10GroupA();
  }

  @Get(':registrationNumber')
  @ApiOperation({ summary: 'Find a student by registration number' })
  @ApiParam({
    name: 'registrationNumber',
    description: 'Student registration number',
  })
  @ApiResponse({
    status: 200,
    description: 'The student record',
    type: Student,
  })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async findByRegistrationNumber(
    @Param('registrationNumber') registrationNumber: string,
  ): Promise<any> {
    return this.studentsService.findByRegistrationNumber(registrationNumber);
  }
}
