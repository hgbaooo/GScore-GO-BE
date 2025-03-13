import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';

@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  createSubject(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectsService.createSubject(createSubjectDto);
  }

  @Get()
  getAllSubject() {
    return this.subjectsService.getAllSubject();
  }

  @Get(':id')
  getSubjectById(@Param('id') id: string) {
    return this.subjectsService.getSubjectById(id);
  }
}
