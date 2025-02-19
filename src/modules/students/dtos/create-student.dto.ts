import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStudentDto {
  @ApiProperty({ description: 'Student registration number' })
  @IsNotEmpty()
  @IsString()
  sbd: string;

  @ApiPropertyOptional({ description: 'Math score' })
  @IsOptional()
  @IsNumber()
  toan?: number;

  @ApiPropertyOptional({ description: 'Literature score' })
  @IsOptional()
  @IsNumber()
  ngu_van?: number;

  @ApiPropertyOptional({ description: 'Foreign Language score' })
  @IsOptional()
  @IsNumber()
  ngoai_ngu?: number;

  @ApiPropertyOptional({ description: 'Physics score' })
  @IsOptional()
  @IsNumber()
  vat_li?: number;

  @ApiPropertyOptional({ description: 'Chemistry score' })
  @IsOptional()
  @IsNumber()
  hoa_hoc?: number;

  @ApiPropertyOptional({ description: 'Biology score' })
  @IsOptional()
  @IsNumber()
  sinh_hoc?: number;

  @ApiPropertyOptional({ description: 'History score' })
  @IsOptional()
  @IsNumber()
  lich_su?: number;

  @ApiPropertyOptional({ description: 'Geography score' })
  @IsOptional()
  @IsNumber()
  dia_li?: number;

  @ApiPropertyOptional({ description: 'Civic Education score' })
  @IsOptional()
  @IsNumber()
  gdcd?: number;

  @ApiPropertyOptional({ description: 'Foreign Language code' })
  @IsOptional()
  @IsString()
  ma_ngoai_ngu?: string;
}
