import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Schema()
export class Student extends Document {
  @ApiProperty({
    description: 'Student registration number',
    uniqueItems: true,
  })
  @Prop({ required: true, unique: true })
  sbd: string;

  @ApiPropertyOptional({ description: 'Math score' })
  @Prop()
  toan: number;

  @ApiPropertyOptional({ description: 'Literature score' })
  @Prop()
  ngu_van: number;

  @ApiPropertyOptional({ description: 'Foreign Language score' })
  @Prop()
  ngoai_ngu: number;

  @ApiPropertyOptional({ description: 'Physics score' })
  @Prop()
  vat_li: number;

  @ApiPropertyOptional({ description: 'Chemistry score' })
  @Prop()
  hoa_hoc: number;

  @ApiPropertyOptional({ description: 'Biology score' })
  @Prop()
  sinh_hoc: number;

  @ApiPropertyOptional({ description: 'History score' })
  @Prop()
  lich_su: number;

  @ApiPropertyOptional({ description: 'Geography score' })
  @Prop()
  dia_li: number;

  @ApiPropertyOptional({ description: 'Civic Education score' })
  @Prop()
  gdcd: number;

  @ApiPropertyOptional({ description: 'Foreign Language code' })
  @Prop()
  ma_ngoai_ngu: string;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
