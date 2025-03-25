import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyDto } from './dto/verify.dto';
import { ResetDto } from './dto/reset.dto';
import { NewPasswordDto } from './dto/new-password.dto';
import { VerifyResetDto } from './dto/verify-reset.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { MailService } from '../mail/mail.service';
import { FileUploadService } from '../upload/upload.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    private readonly fileUploadService: FileUploadService,
  ) { }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findByEmail(loginDto.email);
    if (!user) {
      return new NotFoundException('User not found');
    }
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      return new BadRequestException('Incorrect password');
    }
    if (!user.verified) {
      return new UnauthorizedException('User not verified');
    }
    const payload = { username: user.email, id: user.id, role: user.role };
    const token = this.jwtService.sign(payload);
    const isTokenValid = await this.jwtService.verify(token);
    return {
      status: 200,
      access_token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        verified: user.verified,
      },
      message: 'Login successful',
    };
  }

  async register(registerDto: RegisterDto) {
    const user = await this.userRepository.findByEmail(registerDto.email);
    if (user) {
      return new BadRequestException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const newUser = {
      name: registerDto.name,
      phone: registerDto.phone,
      email: registerDto.email,
      password: hashedPassword,
      role: registerDto.role || 'user',
      verified: false,
      code: Math.floor(1000 + Math.random() * 9000),
    };
    const userId = await this.userRepository.create(newUser);

    if (!newUser) {
      return new InternalServerErrorException('User not created');
    }

    await this.sendCode(userId);

    return {
      userId,
      email: registerDto.email,
      status: 200,
      message: 'User created successfully',
    };
  }

  async verify(verifyDto: VerifyDto) {
    const user = await this.userRepository.findByEmail(verifyDto.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.verified) {
      throw new UnauthorizedException('User already verified');
    }

    if (verifyDto.code !== user.code) {
      throw new BadRequestException('Invalid code');
    }

    try {
      await this.userRepository.update(user.id, {
        verified: true,
        code: null,
      });

      const payload = { username: user.email, id: user.id, role: user.role };

      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          verified: user.verified,
        },
        message: 'Email verified successfully',
        status: 200,
        email: verifyDto.email,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to update user verification status',
      );
    }
  }

  async forgotPassword(resetDto: ResetDto) {
    const user = await this.userRepository.findByEmail(resetDto.email);
    if (!user) {
      return new NotFoundException('User not found');
    }
    const code = Math.floor(100000 + Math.random() * 900000);
    await this.userRepository.update(user.id, { code });
    await this.mailService.sendResetPassword(resetDto.email, code, user.name);
    return {
      message: 'Code sent successfully',
      status: 200,
      email: resetDto.email,
    };
  }

  async resetPassword(verifyResetDto: VerifyResetDto) {
    const user = await this.userRepository.findByEmail(verifyResetDto.email);
    if (!user) {
      return new NotFoundException('User not found');
    }
    if (verifyResetDto.code !== user.code) {
      return new BadRequestException('Invalid code');
    }

    return {
      message: 'Code verified successfully',
      status: 200,
      email: verifyResetDto.email,
    };
  }

  async newPassword(newPasswordDto: NewPasswordDto) {
    const user = await this.userRepository.findByEmail(newPasswordDto.email);
    if (!user) {
      return new NotFoundException('User not found');
    }
    if (newPasswordDto.code !== user.code) {
      return new BadRequestException('Invalid code');
    }
    const hashedPassword = await bcrypt.hash(newPasswordDto.newPassword, 10);
    await this.userRepository.update(user.id, { password: hashedPassword });

    await this.userRepository.update(user.id, { code: null });
    return {
      message: 'Password updated successfully',
      status: 200,
      email: newPasswordDto.email,
    };
  }

  async sendCode(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      return new NotFoundException('User not found');
    }
    await this.mailService.sendUserConfirmation(
      user.email,
      user.code,
      user.name,
    );

    return {
      message: 'Code sent successfully',
      status: 200,
      email: user.email,
    };
  }

  async resendCode(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return new NotFoundException('User not found');
    }
    await this.sendCode(user.id);
    return {
      message: 'Code sent successfully',
      status: 200,
      email: user.email,
    };
  }

  async users() {
    const users = await this.userRepository.findAll();
    if (users.length === 0) {
      return new NotFoundException('No users found');
    }
    return users;
  }

  async getUser(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      return new NotFoundException('User not found');
    }
    return user;
  }

  async getFullUser(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      return new NotFoundException('User not found');
    }
    const userProducts = await this.userRepository.findUserProducts(id);
  }

  async verifyToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token);

      const user = await this.userRepository.findByEmail(decoded.username);

      const isValid = user && user.id === decoded.sub;

      if (!user) {
        return new NotFoundException('User not found');
      }
      return {
        isValid: true,
        message: 'Token verified',
        status: 200,
        user: decoded,
      };
    } catch (error) {
      return new UnauthorizedException('Invalid token');
    }
  }

  async updateUser(token: string, user: any) {
    try {
      const decoded = this.jwtService.verify(token);

      const userExists = await this.userRepository.findById(decoded.id);

      if (!userExists) {
        return new NotFoundException('User not found');
      }

      await this.userRepository.update(decoded.id, user);

      return {
        message: 'User updated successfully',
        status: 200,
        user,
      };
    } catch (error) {
      return new UnauthorizedException('Invalid token');
    }
  }

  async updateBannerPicture(id: string, banner: Express.Multer.File[]) {
    try {
      // Add 'await' here - this was missing
      const user = await this.userRepository.findById(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const imagePaths = await this.fileUploadService.saveImages(banner);

      // Update user with new banner
      const updatedUser = await this.userRepository.update(id, {
        // Only send the necessary fields for update, not the whole user object
        banner: imagePaths[0],
      });

      // if (!updatedUser) {
      //   throw new InternalServerErrorException(
      //     'Failed to update banner picture',
      //   );
      // }

      return {
        message: 'Banner picture updated successfully',
        status: 200,
        data: {
          banner: imagePaths[0],
        },
      };
    } catch (error) {
      console.error('Error in updateBannerPicture:', error);
      if (
        error instanceof NotFoundException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
      throw new UnauthorizedException('Invalid token');
    }
  }

  async updateProfilePicture(id: string, avatar: Express.Multer.File[]) {
    try {
      const user = await this.userRepository.findById(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const imagePaths = await this.fileUploadService.saveImages(avatar);

      if (!imagePaths || imagePaths.length === 0) {
        throw new InternalServerErrorException('Failed to upload image');
      }

      // Update user with new avatar - only send the avatar field
      const result = await this.userRepository.update(id, {
        avatar: imagePaths[0],
      });

      // Only throw error if update failed (result is falsy)
      // if (!result) {
      //   throw new InternalServerErrorException(
      //     'Failed to update profile picture',
      //   );
      // }

      return {
        message: 'Profile picture updated successfully',
        status: 200,
        data: {
          avatar: imagePaths[0],
        },
      };
    } catch (error) {
      console.error('Error in updateProfilePicture:', error);

      if (
        error instanceof NotFoundException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
      throw new UnauthorizedException('Invalid token');
    }
  }
}
