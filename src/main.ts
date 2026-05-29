import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { appSetup } from './setup';
import { CoreConfig } from './core/config';
import { AppModule } from './app.module';

async function bootstrap() {
  // Create our Application
  const app = await NestFactory.create(AppModule);

  const coreConfig = app.get<CoreConfig>(CoreConfig);

  // global app settings
  appSetup(app, coreConfig);

  const PORT = coreConfig.PORT || 3000;

  await app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

bootstrap();
