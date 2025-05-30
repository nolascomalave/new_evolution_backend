import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import session from 'express-session';
import { EXPIRE_TIME } from './Modules/auth/auth.controller';

// Antes de cualquier JSON.stringify()
// ---------------------------------------------------------------------------------------------------------
// -- Modificando la función JSON.stringify para que procese los BigInt y los convierta en números o en ----
// -- string (en caso de superar el valor Number.MAX_SAFE_INTEGER) -----------------------------------------
// ---------------------------------------------------------------------------------------------------------
const originalStringify = JSON.stringify;

JSON.stringify = function(object, replacer, space) {
  const customReplacer = (key, value) => {
    if (typeof value === 'bigint') {
      return (typeof value === 'bigint' ? (!(value < parseInt(value.toString())) && !(value > parseInt(value.toString())) ? parseInt(value.toString()) : value.toString()) : value);
    }
    return replacer ? replacer(key, value) : value;
  };

  return originalStringify(object, customReplacer, space);
};
// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, /* {
    cors: true
  } */);

  app.use(
    session({
      secret: process.env.COOKIE_SESSION_SECRET, // Cambia esto por una clave segura y guárdala en variables de entorno
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true, // Previene acceso a la cookie desde JavaScript en el cliente
        secure: process.env.NODE_ENV === 'production', // Solo enviar cookies sobre HTTPS en producción
        maxAge: EXPIRE_TIME, // Duración de la cookie (1 día)
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        domain: 'localhost',
        path: '/'
      },
    }),
  );

  app.enableCors({
    origin: 'http://localhost:5173', // Cambia esto por el origen de tu aplicación cliente
    credentials: true, // Permite el envío de credenciales (cookies)
  });

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    stopAtFirstError: true
  }));

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));

  await app.listen(3000);
}
bootstrap();