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
  registrationNumber: string;

  @ApiPropertyOptional({ description: 'Foreign language code' })
  @Prop()
  foreignLanguageCode: string;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
