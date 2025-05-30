import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { TestModule } from './Modules/test/test.module';
import { SystemSubscriptionUserModule } from './Modules/system_subscription_user/system_subscription_user.module';
import { AuthModule } from './Modules/auth/auth.module';
// import { MulterModule } from '@nestjs/platform-express';
import { MailerModule } from './mailer/mailer.module';
import { ConfigModule } from '@nestjs/config';
import { EntityTypeModule } from './Modules/entity_type/entity_type.module';

@Module({
  imports: [
    MailerModule,
    /* TestModule,  */
    AuthModule,
    EntityTypeModule,
    SystemSubscriptionUserModule,
    MailerModule
  ],
  // controllers: [AppController]
})
export class AppModule {}
