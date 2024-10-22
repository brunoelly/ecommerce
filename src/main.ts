import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import { configDotenv } from 'dotenv';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);


    app.useGlobalPipes(new ValidationPipe({
        transform: true,
    }));

    const options = new DocumentBuilder()
        .setTitle('Ecommerce API')
        .setDescription('API for managing customers')
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);

    await app.listen(3000);
    app.enableCors();
    configDotenv();
}
bootstrap();