import 'dotenv/config';
import { get } from 'http';
import { createWriteStream } from 'fs';
import { NestFactory } from '@nestjs/core';
import { appSetup } from './setup';
import { CoreConfig } from './core/config';
import { AppModule } from './app.module';
import { ENVIRONMENTS } from './constants';

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

  // Get the swagger json file (if app is running in development mode)
  if (coreConfig.NODE_ENV === ENVIRONMENTS.DEVELOPMENT) {
    const serverUrl = `http://localhost:${coreConfig.PORT}`;

    // Write swagger ui files
    get(`${serverUrl}/api/swagger-ui-bundle.js`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui-bundle.js'));
      console.log(
        `Swagger UI bundle file written to: '/swagger-static/swagger-ui-bundle.js'`,
      );
    });

    get(`${serverUrl}/api/swagger-ui-init.js`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui-init.js'));
      console.log(
        `Swagger UI init file written to: '/swagger-static/swagger-ui-init.js'`,
      );
    });

    get(
      `${serverUrl}/api/swagger-ui-standalone-preset.js`,
      function (response) {
        response.pipe(
          createWriteStream('swagger-static/swagger-ui-standalone-preset.js'),
        );
        console.log(
          `Swagger UI standalone preset file written to: '/swagger-static/swagger-ui-standalone-preset.js'`,
        );
      },
    );

    get(`${serverUrl}/api/swagger-ui.css`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui.css'));
      console.log(
        `Swagger UI css file written to: '/swagger-static/swagger-ui.css'`,
      );
    });
  }
}

bootstrap();
