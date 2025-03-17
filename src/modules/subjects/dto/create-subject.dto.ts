import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSubjectDto {
  @ApiProperty({
    description: 'Subject name',
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}
