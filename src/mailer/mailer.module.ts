import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerController } from './mailer.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [MailerController],
  providers: [MailerService],
  imports: [ConfigModule.forRoot()],
  exports: [MailerService]
})

export class MailerModule {}
