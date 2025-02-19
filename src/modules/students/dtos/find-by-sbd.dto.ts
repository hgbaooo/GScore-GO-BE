import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindBySbdDto {
  @ApiProperty({ description: 'Student registration number' })
  @IsNotEmpty()
  @IsString()
  sbd: string;
}
