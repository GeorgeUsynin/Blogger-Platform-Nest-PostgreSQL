import { OmitType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { UserViewDto } from './user.view-dto';
import { UserQueryModel } from '../../../infrastructure/repositories/query/model/UserQueryModel';

export class MeViewDto extends OmitType(UserViewDto, [
  'createdAt',
  'id',
] as const) {
  @ApiProperty()
  userId: string;

  static mapToView(user: UserQueryModel): MeViewDto {
    const dto = new MeViewDto();

    dto.email = user.email;
    dto.login = user.login;
    dto.userId = user.id.toString();

    return dto;
  }
}
