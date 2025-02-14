import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
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
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
  ) {}

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
    const payload = { username: user.email, sub: user.id };
    return {
      status: 200,
      access_token: this.jwtService.sign(payload),
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
      favorites: [],
      role: 'user',
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
      return new NotFoundException('User not found');
    }
    if (user.verified) {
      return new UnauthorizedException('User already verified');
    }
    if (verifyDto.code !== user.code) {
      return new BadRequestException('Invalid code');
    }

    const updated = this.userRepository.update(verifyDto.email, {
      verified: true,
      code: null,
    });

    return {
      message: 'Email verified successfully',
      status: 200,
      email: verifyDto.email,
    };
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
    // remove the code from the user
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
}
