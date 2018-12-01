import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


async function bootstrap() {

  const cors = {
    origin: 'http://localhost:4200'
  }

  const app = await NestFactory.create(AppModule, {
    cors
  });

  await app.listen(3000);
}
bootstrap();
