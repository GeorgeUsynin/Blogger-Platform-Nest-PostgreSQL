import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure';
import {
  EmailAlreadyExistsError,
  LoginAlreadyExistsError,
} from '../../../../core/exceptions';
import { CreateUserDto } from './dto';
import { PasswordHasherService } from './password-hasher.service';
import { CreateUserRepositoryDto } from '../infrastructure/dto';

@Injectable()
export class UserCreationService {
  constructor(
    private usersRepository: UsersRepository,
    private passwordHasherService: PasswordHasherService,
  ) {}

  async prepareUserCreation(
    dto: CreateUserDto,
  ): Promise<CreateUserRepositoryDto> {
    const { email, login, password } = dto;

    await this.ensureUserUniqOrThrow(login, email);

    const passwordHash =
      await this.passwordHasherService.hashPassword(password);

    const now = new Date().toISOString();

    const createUserRepositoryDto: CreateUserRepositoryDto = {
      email,
      login,
      passwordHash,
      createdAt: now,
      updatedAt: now,
    };

    return createUserRepositoryDto;
  }

  async ensureUserUniqOrThrow(login: string, email: string): Promise<void> {
    const userWithExistedLogin =
      await this.usersRepository.findUserByLogin(login);

    if (userWithExistedLogin) {
      throw new LoginAlreadyExistsError();
    }

    const userWithExistedEmail =
      await this.usersRepository.findUserByEmail(email);

    if (userWithExistedEmail) {
      throw new EmailAlreadyExistsError();
    }
  }
}
