import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure';
import {
  EmailAlreadyExistsError,
  LoginAlreadyExistsError,
} from '../../../../core/exceptions';
import { CreateUserDto, CreateUserUseCaseDto } from './dto';
import { PasswordHasherService } from './password-hasher.service';

@Injectable()
export class UserCreationService {
  constructor(
    private usersRepository: UsersRepository,
    private passwordHasherService: PasswordHasherService,
  ) {}

  async prepareUserCreation(dto: CreateUserDto): Promise<CreateUserUseCaseDto> {
    const { email, login, password } = dto;

    await this.ensureUserUniqueOrThrow(login, email);

    const passwordHash =
      await this.passwordHasherService.hashPassword(password);

    const createUserDomainDto: CreateUserUseCaseDto = {
      email,
      login,
      passwordHash,
    };

    return createUserDomainDto;
  }

  async ensureUserUniqueOrThrow(login: string, email: string): Promise<void> {
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
