import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure';
import { PasswordHasherService } from './password-hasher.service';
import { UserContextDto } from '../guards/dto';
import { EmailNotConfirmedError } from '../../../../core/exceptions';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private passwordHasherService: PasswordHasherService,
  ) {}

  async validateUser(
    loginOrEmail: string,
    password: string,
  ): Promise<UserContextDto | null> {
    const foundUser =
      await this.usersRepository.findUserByLoginOrEmail(loginOrEmail);

    if (!foundUser) return null;

    const isValidPassword = await this.passwordHasherService.comparePassword(
      password,
      foundUser.passwordHash,
    );

    if (!isValidPassword) return null;

    if (!foundUser.emailConfirmation.isConfirmed) {
      throw new EmailNotConfirmedError();
    }

    return { userId: foundUser.id };
  }
}
