import { Controller, Post, Body, Get, Request, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyDto } from './dto/verify.dto';
import { ResetDto } from './dto/reset.dto';
import { NewPasswordDto } from './dto/new-password.dto';
import { VerifyResetDto } from './dto/verify-reset.dto';
import { CodeDto } from './dto/code.dto';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.userService.register(registerDto);
  }

  @Post('verify')
  async verify(@Body() verifyDto: VerifyDto) {
    return this.userService.verify(verifyDto);
  }

  @Post('reset/email')
  async forgotPassword(@Body() resetDto: ResetDto) {
    return this.userService.forgotPassword(resetDto);
  }

  @Post('reset/verify')
  async resetPassword(@Body() verifyResetDto: VerifyResetDto) {
    return this.userService.resetPassword(verifyResetDto);
  }

  @Post('reset/new-password')
  async newPassword(@Body() newPasswordDto: NewPasswordDto) {
    return this.userService.newPassword(newPasswordDto);
  }

  @Get('reset/resend/:email')
  async resendCode(@Param('email') codeDto: CodeDto) {
    return this.userService.sendCode(codeDto.email);
  }
}
