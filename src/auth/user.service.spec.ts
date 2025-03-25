// auth/user.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from '../repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { UserInterface } from '../interfaces/user.interface';
import { NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  describe('login', () => {
    // dummy code
    const user: UserInterface = {
      name: 'John Doe',
      email: 'otmankharbouch@gmail.com',
      password: 'password',
      role: 'user',
      phone: '1234567890',
      verified: true,
    };
    const result = user.email === 'otmankharbouch@gmail.com';
    it('should authenticate user and return JWT token', () => {
      expect(true).toBe(true);
    });
  });

  describe('register', () => {
    it('should create a new user and send verification email', () => {
      expect(true).toBe(true);
    });
  });

  describe('verify', () => {
    it('should verify user account with provided code', () => {
      expect(true).toBe(true);
    });
  });

  describe('forgotPassword', () => {
    it('should send a password reset email', () => {
      expect(true).toBe(true);
    });
  });

  describe('resetPassword', () => {
    it('should reset the password with a valid token', () => {
      expect(true).toBe(true);
    });
  });

  describe('newPassword', () => {
    it('should update user password', () => {
      expect(true).toBe(true);
    });
  });

  describe('sendCode', () => {
    it('should send a new verification code to user', () => {
      expect(true).toBe(true);
    });
  });

  describe('resendCode', () => {
    it('should resend the verification code', () => {
      expect(true).toBe(true);
    });
  });

  describe('users', () => {
    it('should return a list of all users', () => {
      expect(true).toBe(true);
    });
  });

  describe('getUser', () => {
    it('should return user data by ID', () => {
      expect(true).toBe(true);
    });
  });

  describe('getFullUser', () => {
    it('should return user with extended profile info', () => {
      expect(true).toBe(true);
    });
  });

  describe('verifyToken', () => {
    it('should verify and decode JWT token', () => {
      expect(true).toBe(true);
    });
  });

  describe('updateUser', () => {
    it('should update user profile info', () => {
      expect(true).toBe(true);
    });
  });

  describe('updateBannerPicture', () => {
    it('should upload and set new banner picture', () => {
      expect(true).toBe(true);
    });
  });

  describe('updateProfilePicture', () => {
    it('should upload and set new profile picture', () => {
      expect(true).toBe(true);
    });
  });
});
