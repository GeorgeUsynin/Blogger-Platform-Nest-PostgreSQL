import { OmitType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { UserViewDto } from './user.view-dto';
import { TUserDB } from '../../../infrastructure/types';

export class MeViewDto extends OmitType(UserViewDto, [
  'createdAt',
  'id',
] as const) {
  @ApiProperty()
  userId: string;

  static mapToView(user: TUserDB): MeViewDto {
    const dto = new MeViewDto();

    dto.email = user.email;
    dto.login = user.login;
    dto.userId = user.id.toString();

    return dto;
  }
}
