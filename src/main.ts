import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import session from 'express-session';
import { EXPIRE_TIME } from './Modules/auth/auth.controller';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule/* , {
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