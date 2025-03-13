import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class CreateScoreDto {
  @ApiProperty({
    description: 'Student registration number',
  })
  @IsNotEmpty()
  @IsString()
  registrationNumber: string;

  @ApiProperty({
    description: 'Subject name',
  })
  @IsNotEmpty()
  @IsString()
  subject: string;

  @ApiProperty({
    description: 'Score',
  })
  @IsNotEmpty()
  @IsNumber()
  score: number;
}
