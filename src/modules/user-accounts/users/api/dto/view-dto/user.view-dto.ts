import { ApiProperty } from '@nestjs/swagger';
import { TUserDB } from '../../../infrastructure/types';

export class UserViewDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  login: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  public static mapToView(user: TUserDB): UserViewDto {
    const dto = new UserViewDto();

    dto.id = user.id.toString();
    dto.email = user.email;
    dto.login = user.login;
    dto.createdAt = user.createdAt;

    return dto;
  }
}
