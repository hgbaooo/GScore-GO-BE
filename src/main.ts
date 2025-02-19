import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  ValidationPipe,
  Logger as AppLogger,
} from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new AppLogger(bootstrap.name);
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port') ?? 3000;

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
      exceptionFactory: (errors) => {
        const result =
          errors[0].constraints && Object.keys(errors[0].constraints).length > 0
            ? errors[0].constraints[Object.keys(errors[0].constraints)[0]]
            : 'Validation error';
        return new BadRequestException(result);
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Student Score API')
    .setDescription('API for managing student scores')
    .setVersion('1.0')
    .addTag('students')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
		origin: [
			'http://localhost:5173',
			'https://g-score-go-internship-assignment-fe.vercel.app',
      'https://g-score-go-internship-assignment-fe-hgbaooos-projects.vercel.app',
		],
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
		credentials: true,
	});

  await app.listen(port);
  logger.log(`Server running on http://localhost:${configService.get('PORT')}`);
  logger.log(`API Docs http://localhost:${configService.get('PORT')}/api`);
}
bootstrap().catch((error) => {
  console.error('Error during bootstrap:', error);
});
