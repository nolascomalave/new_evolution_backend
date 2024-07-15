import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { TestModule } from './Modules/test/test.module';
import { SystemSubscriptionUserModule } from './Modules/system_subscription_user/system_subscription_user.module';
import { AuthModule } from './Modules/auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
// import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    /* MulterModule.register({
        dest: './upload',
    }), */
    /* TestModule,  */
    AuthModule,
    SystemSubscriptionUserModule
  ],
  // controllers: [AppController]
})
export class AppModule {}
