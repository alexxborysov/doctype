import { User } from '@prisma/client';
import { getBearerToken } from '~/application/auth/lib/extract-token';
import { HashService } from '~/application/auth/services/hash.service';
import { UserRepository } from '~/application/user/services/user.repository';
import { LoginSchema } from '../dto';
import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios, { HttpStatusCode } from 'axios';
import { Request } from 'express';
import { z } from 'zod';
import { VerificationService } from './verification.service';
import { generateRandomPassword } from '../lib/generate-random-password';

@Injectable()
export class AuthService {
  constructor(
    private hashService: HashService,
    private jwtService: JwtService,
    private userRepository: UserRepository,
    private verificationService: VerificationService
  ) {}

  async generateTokens({ user }: { user: User }) {
    return {
      access: this.jwtService.sign(
        { sub: user.id, role: user.role, email: user.email },
        { expiresIn: '7m' }
      ),
      refresh: this.jwtService.sign(
        { sub: user.id, role: user.role, email: user.email },
        { expiresIn: '7d' }
      ),
    };
  }

  async login({ email, password }: z.infer<typeof LoginSchema>) {
    const user = await this.userRepository.findByEmail({ email });

    if (!user) {
      throw new HttpException(
        'Invalid email or password. Please try again!',
        HttpStatusCode.Conflict
      );
    }

    const isPasswordMatch = await this.hashService.compare(
      password,
      user.password
    );

    if (!isPasswordMatch) {
      throw new HttpException(
        'Invalid email or password. Please try again!',
        HttpStatusCode.Conflict
      );
    }
    if (!user.verified) {
      await this.verificationService.sendVerificationCode({ email });
      throw new HttpException(
        'Please, verify your account',
        HttpStatusCode.UpgradeRequired
      );
    }

    const tokens = await this.generateTokens({ user });
    const { password: _, ...viewer } = user;

    return {
      tokens,
      viewer,
    };
  }

  private async upsertUser(email: string) {
    const existedUser = await this.userRepository
      .findByEmail({
        email,
      })
      .catch(null);

    if (!existedUser) {
      const createdUser = await this.userRepository.create({
        email,
        password: await this.hashService.hash(generateRandomPassword(16)),
      });
      const tokens = await this.generateTokens({
        user: createdUser,
      });
      const { password, ...viewer } = createdUser;
      if (!viewer.verified) {
        this.userRepository.verify({ userId: viewer.id });
      }

      return { viewer, tokens };
    } else {
      const tokens = await this.generateTokens({
        user: existedUser,
      });
      const { password, ...viewer } = existedUser;
      if (!viewer.verified) {
        this.userRepository.verify({ userId: viewer.id });
      }

      return { viewer, tokens };
    }
  }

  async googleLogin(token: string) {
    const googleUser = await axios.request<{ email: string }>({
      method: 'GET',
      url: 'https://www.googleapis.com/oauth2/v3/userinfo',
      headers: {
        Authorization: token,
      },
    });

    if (!googleUser) {
      throw new HttpException('Unauthorized', HttpStatusCode.Locked);
    }

    return this.upsertUser(googleUser.data.email);
  }

  async loginWithGithubApp(code: string) {
    const GITHUB_APP_CLIENT_ID = process.env.GITHUB_APP_CLIENT_ID!;
    const GITHUB_APP_CLIENT_SECRET = process.env.GITHUB_APP_CLIENT_SECRET!;
    const url_exchange = `https://github.com/login/oauth/access_token`;
    const url_user = `https://api.github.com/user/public_emails`;
    const data = new FormData();
    data.append('client_id', GITHUB_APP_CLIENT_ID);
    data.append('client_secret', GITHUB_APP_CLIENT_SECRET);
    data.append('code', code);

    const {
      data: { access_token },
    } = await axios({
      method: 'POST',
      url: url_exchange,
      headers: {
        accept: 'application/json',
      },
      data,
    });
    const {
      data: [first],
    } = await axios<{ email: string }[]>({
      method: 'GET',
      url: url_user,
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
        authorization: `Bearer ${access_token}`,
      },
    });

    if (!first) {
      throw new HttpException('Unauthorized', HttpStatusCode.Locked);
    }

    return this.upsertUser(first.email);
  }

  async refresh(token: string | undefined) {
    if (!token) {
      throw new HttpException('Token is not defined', HttpStatusCode.Locked);
    }

    const verified_token = await this.jwtService
      .verifyAsync(token)
      .catch(() => {
        throw new HttpException('Invalid token', HttpStatusCode.Locked);
      });

    const { sub, role } = verified_token;
    const access = this.jwtService.sign({ sub, role }, { expiresIn: '7m' });
    const refresh = this.jwtService.sign({ sub, role }, { expiresIn: '7d' });

    return {
      access,
      refresh,
    };
  }

  async checkSession(req: Request) {
    const bearer = getBearerToken(req);
    if (!bearer) {
      throw new HttpException('Invalid token', HttpStatusCode.Locked);
    }

    const { sub } = await this.jwtService.verifyAsync(bearer).catch(() => {
      throw new HttpException('Unauthorized', HttpStatusCode.Unauthorized);
    });

    const sessionUser = await this.userRepository.findById({
      id: sub,
      select: {
        email: true,
        id: true,
        role: true,
        verified: true,
      },
    });

    if (!sessionUser) {
      throw new HttpException('Unauthorized', HttpStatusCode.Locked);
    }

    return {
      viewer: sessionUser,
    };
  }

  async extractReqSession(req: Request) {
    const bearer = getBearerToken(req);
    if (!bearer) return null;

    const session = await this.jwtService.verifyAsync(bearer).catch(() => {
      throw new HttpException('Invalid token', 403);
    });
    return session as { sub: string; role: string; email: string };
  }
}
