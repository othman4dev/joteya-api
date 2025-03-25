import {
  Controller,
  Post,
  Body,
  Get,
  Request,
  Put,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyDto } from './dto/verify.dto';
import { ResetDto } from './dto/reset.dto';
import { NewPasswordDto } from './dto/new-password.dto';
import { VerifyResetDto } from './dto/verify-reset.dto';
import { CodeDto } from './dto/code.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadedFiles } from '@nestjs/common';

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

  @Get('users')
  async users() {
    return this.userService.users();
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

  @Get('token/verify/:token')
  async verifyToken(@Param('token') token: string) {
    return this.userService.verifyToken(token);
  }

  @Get('users/:id')
  async getUser(@Param('id') id: string) {
    return this.userService.getUser(id);
  }

  @Put('users/update/:token')
  async updateUser(@Param('token') token: string, @Body() user: any) {
    return this.userService.updateUser(token, user);
  }

  @Put('users/update/pp/:token')
  @UseInterceptors(FilesInterceptor('avatar'))
  async updateProfilePicture(
    @Param('token') token: string,
    @UploadedFiles() avatar: Express.Multer.File[],
  ) {
    return this.userService.updateProfilePicture(token, avatar);
  }

  @Put('users/update/bn/:id')
  @UseInterceptors(FilesInterceptor('banner'))
  async updateBanner(
    @Param('id') id: string,
    @UploadedFiles() banner: Express.Multer.File[],
  ) {
    return this.userService.updateBannerPicture(id, banner);
  }
}
