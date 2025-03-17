import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStudentDto {
  @ApiProperty({ description: 'Student registration number' })
  @IsNotEmpty()
  @IsString()
  registrationNumber: string;

  @ApiProperty({ description: 'Foreign Language code' })
  @IsOptional()
  @IsString()
  foreignLanguageCode?: string;
}
