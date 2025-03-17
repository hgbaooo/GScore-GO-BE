import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema()
export class Subject extends Document {
  @ApiProperty({
    description: 'Subject name',
  })
  @Prop({ required: true, unique: true })
  name: string;
}

export const SubjectSchema = SchemaFactory.createForClass(Subject);
