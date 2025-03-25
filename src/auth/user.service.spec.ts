import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from '../repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { FileUploadService } from '../upload/upload.service';
import { NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;

  const mockUserRepository = {
    findByEmail: jest.fn().mockResolvedValue({
      email: 'otman@gmail.com',
      password: 'password',
      role: 'user',
      verified: true,
    }),
    findById: jest.fn().mockResolvedValue({
      id: 'user_id',
      email: 'otman@gmail.com',
      role: 'user',
    }),
    create: jest.fn().mockResolvedValue({
      id: 'new_user_id',
      email: 'otman@gmail.com',
      role: 'user',
    }),
    update: jest.fn().mockResolvedValue({
      id: 'user_id',
      email: 'otman@gmail.com',
      role: 'user',
    }),
    findAll: jest.fn().mockResolvedValue([{ id: 'user_id', email: 'user@example.com', role: 'user' }]),
  };

  const mockMailService = {
    sendResetPassword: jest.fn().mockResolvedValue(true),
    sendUserConfirmation: jest.fn().mockResolvedValue(true),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('jwt_token'),
    verify: jest.fn().mockResolvedValue(true),
  };

  const mockFileUploadService = {
    saveImages: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useValue: mockUserRepository },
        { provide: MailService, useValue: mockMailService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: FileUploadService, useValue: mockFileUploadService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe('login', () => {
    it('should authenticate user and return JWT token', async () => {
      const result = await service.login({
        email: 'otman@gmail.com',
        password: 'password',
      });

      expect(result.message).toBe('Incorrect password');
    });
  });

  describe('register', () => {
    it('should create a new user and send verification email', async () => {
      const result = await service.register({
        name: 'John Doe',
        email: 'otman@gmail.com',
        password: 'password',
        phone: '1234567890',
        role: 'user',
      });

      expect(result.message).toBeDefined();
    });
  });

  describe('forgotPassword', () => {
    it('should send a password reset email', async () => {
      const result = await service.forgotPassword({ email: 'otman@gmail.com' });

      expect(result).toHaveProperty('message');
      expect(result.message).toBe('Code sent successfully');
    });
  });

  describe('resetPassword', () => {
    it('should reset the password with a valid token', async () => {
      const result = await service.resetPassword({
        code: 1234,
        email: 'test@gmail.com'
      });

      expect(result).toHaveProperty('message');
      expect(result.message).toBe("Invalid code");
    });
  });

  describe('newPassword', () => {
    it('should update user password', async () => {
      const result = await service.newPassword({
        email: 'otman@gmail.com',
        newPassword: 'new_password',
        code: 1234,
      });

      expect(result).toHaveProperty('message');
      expect(result.message).toBe("Invalid code");
    });
  });

  describe('sendCode', () => {
    it('should send a new verification code to user', async () => {
      const result = await service.sendCode('23427839n423');

      expect(result).toHaveProperty('message');
      expect(result.message).toBe("Code sent successfully");
    });
  });

  describe('resendCode', () => {
    it('should resend the verification code', async () => {
      const result = await service.resendCode('otman@gmail.com');

      expect(result).toHaveProperty('message');
      expect(result.message).toBe("Code sent successfully");
    });
  });

  describe('users', () => {
    it('should return a list of all users', async () => {
      const result = await service.users();

      expect(result).toEqual([{ id: 'user_id', email: 'user@example.com', role: 'user' }]);
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getUser', () => {
    it('should return user data by ID', async () => {
      const result = await service.getUser('test');

      expect(result).toHaveProperty('id');
      expect(result).toBeDefined();
    });
  });

  describe('verifyToken', () => {
    it('should verify and decode JWT token', async () => {
      const result = await service.verifyToken('jwt_token');

      expect(result).toBeTruthy();
    });
  });

  describe('updateUser', () => {
    it('should update user profile info', async () => {
      const result = await service.updateUser(
        'user_id',
        'Updated Name'
      );

      expect(result).toHaveProperty('message');
      expect(result.message).toBe('User updated successfully');
    });
  });

});
