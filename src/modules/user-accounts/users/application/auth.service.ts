import { Injectable } from '@nestjs/common';
import {
  EmailConfirmationsRepository,
  UsersRepository,
} from '../infrastructure';
import { PasswordHasherService } from './password-hasher.service';
import { UserContextDto } from '../guards/dto';
import { EmailNotConfirmedError } from '../../../../core/exceptions';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private emailConfirmationsRepository: EmailConfirmationsRepository,
    private passwordHasherService: PasswordHasherService,
  ) {}

  async validateUser(
    loginOrEmail: string,
    password: string,
  ): Promise<UserContextDto | null> {
    const user =
      await this.usersRepository.findUserByLoginOrEmail(loginOrEmail);

    if (!user) return null;

    const isValidPassword = await this.passwordHasherService.comparePassword(
      password,
      user.passwordHash,
    );

    if (!isValidPassword) return null;

    const emailConfirmation =
      await this.emailConfirmationsRepository.findEmailConfirmationByUserId(
        user.id,
      );

    if (!emailConfirmation) return null;

    if (!emailConfirmation.isConfirmed) {
      throw new EmailNotConfirmedError();
    }

    return { userId: user.id };
  }
}
