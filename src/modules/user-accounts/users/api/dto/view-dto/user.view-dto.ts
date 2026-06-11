import { ApiProperty } from '@nestjs/swagger';
import { UserQueryModel } from '../../../infrastructure/repositories/query/model';

export class UserViewDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  login: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  public static mapToView(user: UserQueryModel): UserViewDto {
    const dto = new UserViewDto();

    dto.id = user.id.toString();
    dto.email = user.email;
    dto.login = user.login;
    dto.createdAt = user.createdAt;

    return dto;
  }
}
