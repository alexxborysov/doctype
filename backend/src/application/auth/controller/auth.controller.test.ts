import { UserModule } from '~/application/user/user.module';
import { AuthModule } from '~/application/auth/auth.module';
import { UserRepository } from '~/application/user/services/user.repository';
import { DBService } from '~/infrastructure/db/db.service';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { HashService } from '~/application/auth/services/hash.service';
import { VerificationService } from '~/application/auth/services/verification.service';
import { SendgridService } from '~/infrastructure/mail/services/sendgrid.service';
import { MailService } from '@sendgrid/mail';
import { SENDGRID_SERVICE } from '~/infrastructure/mail/config/constants';
import { AuthService } from '~/application/auth/services/auth.service';
import { AppModule } from '~/kernel/app.module';
import { AuthController } from './auth.controller';

const TEST_USER_DATA = {
  email: 'alexborysovdev_test@gmail.com',
  password: 'long-password',
};

describe('auth-controller', () => {
  let authController: AuthController;
  let authService: AuthService;
  let user: UserRepository;
  let db: DBService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        AuthModule,
        UserModule,
        AppModule,
        ConfigModule.forRoot({ isGlobal: true }),
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        HashService,
        VerificationService,
        DBService,
        SendgridService,
        MailService,
        {
          provide: SENDGRID_SERVICE,
          useValue: {
            send: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = app.get<AuthService>(AuthService);
    authController = app.get<AuthController>(AuthController);
    user = app.get<UserRepository>(UserRepository);
    db = app.get<DBService>(DBService);
  });

  afterEach(async () => {
    /* clean up */
    await db.verificationCode
      .delete({
        where: {
          email: TEST_USER_DATA.email,
        },
      })
      .catch(console.log);
    await user
      .delete({
        where: {
          email: TEST_USER_DATA.email,
        },
      })
      .catch(console.log);
  });

  it('should return tokens with user-id', async () => {
    const signupResponse = await authController.signUp(TEST_USER_DATA);
    expect(signupResponse.createdUser).toBeDefined();

    if (signupResponse.createdUser) {
      /* skip verification step */
      await db.user.update({
        where: {
          id: signupResponse.createdUser.id,
        },
        data: {
          verified: true,
        },
      });

      const login_res = await authController.login({
        email: signupResponse.createdUser.email,
        password: TEST_USER_DATA.password,
      });

      expect(login_res.tokens.access).toBeDefined();
      expect(login_res.tokens.refresh).toBeDefined();

      const session = await authService.checkSession({
        headers: {
          authorization: `Bearer ${login_res.tokens.access}`,
        },
      } as any);
      expect(session.viewer).toBeDefined();
    }
  });
});
