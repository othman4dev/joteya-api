import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirestoreModule } from './firestore/firestore.module';
import { ConfigModule } from '@nestjs/config';
import { UserRepository } from './repositories/user.repository';
import { UserModule } from './auth/user.module';
import { MailModule } from './mail/mail.module';

@Global()
@Module({
  imports: [
    FirestoreModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService, UserRepository],
  exports: [UserRepository, MailModule],
})
export class AppModule {}
