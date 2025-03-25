import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtStrategy } from './jwt/jwt.strategy';
import { AuthGuard } from '../guards/AuthGuard.guard';
import { UserRepository } from '../repositories/user.repository';
import { MailModule } from '../mail/mail.module';
import { FirestoreModule } from '../firestore/firestore.module';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    MailModule,
    FirestoreModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '365d' },
      }),
      inject: [ConfigService],
    }),
    UploadModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, AuthGuard, JwtStrategy],
  exports: [AuthGuard, JwtModule, UserService, UserRepository],
})
export class UserModule {}
