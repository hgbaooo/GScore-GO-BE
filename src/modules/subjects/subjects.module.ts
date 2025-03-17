import { Module } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { SubjectsController } from './subjects.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SubjectSchema } from './entities/subject.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Subject', schema: SubjectSchema }]),
  ],
  controllers: [SubjectsController],
  providers: [SubjectsService],
  exports: [SubjectsService, MongooseModule],
})
export class SubjectModule {}
