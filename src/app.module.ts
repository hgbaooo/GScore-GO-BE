import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration } from './configs/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentsModule } from './modules/students/students.module';
import * as Joi from 'joi';
import { SubjectModule } from './modules/subjects/subjects.module';
import { ScoreModule } from './modules/scores/scores.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        MONGODB_URI: Joi.string().required(),
      }),
      validationOptions: {
        abortEarly: false,
      },
      isGlobal: true,
      envFilePath: '.env',
      load: [configuration],
      cache: true,
      expandVariables: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    SubjectModule,
    StudentsModule,
    ScoreModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
