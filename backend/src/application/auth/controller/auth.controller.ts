import { HttpStatusCode } from 'axios';
import { z } from 'zod';
import {
  SignUpDto,
  LoginDto,
  VerificationDto,
} from 'core/dist-cjs/src/dto/auth.dto';
import { ZodValidationPipe } from '~/kernel/pipes/zod.validation.pipe';
import { AuthService } from '~/application/auth/services/auth.service';
import { HashService } from '~/application/auth/services/hash.service';
import { VerificationService } from '~/application/auth/services/verification.service';
import { UserRepository } from '~/application/user/services/user.repository';
import {
  Body,
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  Post,
  Put,
  Res,
  Query,
  Req,
  UsePipes,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { getOAuthToken, getRefreshToken } from '../lib/extract-token';

@Controller('auth')
export class AuthController {
  constructor(
    private userRepository: UserRepository,
    private hashService: HashService,
    private verificationService: VerificationService,
    private authService: AuthService
  ) {}

  @Post('sign-up')
  @UsePipes(new ZodValidationPipe(SignUpDto))
  async signUp(@Body() credentials: z.infer<typeof SignUpDto>) {
    const hashedPassword = await this.hashService.hash(credentials.password);
    const payload = {
      ...credentials,
      password: hashedPassword,
    };

    const createdUser = await this.userRepository.create(payload);
    if (createdUser) {
      this.verificationService.sendVerificationCode({
        email: createdUser.email,
      });
    }

    return { createdUser };
  }

  @Put('verify')
  @UsePipes(new ZodValidationPipe(VerificationDto))
  async verify(@Body() { code, email }: z.infer<typeof VerificationDto>) {
    const user = await this.verificationService.verify({ code, email });
    if (!user?.verified) throw new InternalServerErrorException();

    return {
      verified: user.verified,
    };
  }

  @Post('login')
  @UsePipes(new ZodValidationPipe(LoginDto))
  async login(@Body() data: z.infer<typeof LoginDto>) {
    return await this.authService.login(data);
  }

  @Get('google-login')
  async googleLogin(@Req() req: Request) {
    const token = getOAuthToken(req);

    if (!token?.length) {
      throw new HttpException('Unauthorized', HttpStatusCode.Locked);
    }

    return await this.authService.googleLogin(token);
  }

  @Get('session')
  async session(@Req() req: Request) {
    return await this.authService.checkSession(req);
  }

  @Get('refresh')
  async refresh(@Req() req: Request) {
    return await this.authService.refresh(getRefreshToken(req));
  }

  @Get('callback/github-app')
  async githubAppCallback(@Query('code') code: string, @Res() res: Response) {
    const { tokens } = await this.authService.loginWithGithubApp(code);

    res.cookie('github_token', tokens.refresh, {
      secure: true,
      httpOnly: true,
    });

    return res.redirect(
      process.env.FRONTEND_APP_URL! + '?' + 'github-auth-verified'
    );
  }

  @Get('exchange-github-token')
  async exchangeGitHubToken(@Req() req: Request) {
    const githubToken = req.cookies['github_token'];
    const pair = await this.authService.refresh(githubToken);

    return { tokens: pair };
  }
}
