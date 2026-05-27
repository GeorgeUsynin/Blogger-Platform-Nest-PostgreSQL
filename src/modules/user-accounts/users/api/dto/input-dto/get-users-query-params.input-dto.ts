import { ApiProperty } from '@nestjs/swagger';
import { BaseQueryParamsInputDto } from '../../../../../../core/dto';
import { UserSortByFields } from './user-sort-by-fields';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class GetUsersQueryParamsInputDto extends BaseQueryParamsInputDto {
  @ApiProperty({
    enum: UserSortByFields,
    required: false,
    default: UserSortByFields.CreatedAt,
  })
  @IsEnum(UserSortByFields)
  sortBy: UserSortByFields = UserSortByFields.CreatedAt;

  @ApiProperty({
    type: String,
    description:
      'Search term for user Login: Login should contains this term in any position',
    required: false,
  })
  @IsString()
  @IsOptional()
  searchLoginTerm: string = '';

  @ApiProperty({
    type: String,
    description:
      'Search term for user Email: Email should contains this term in any position',
    required: false,
  })
  @IsString()
  @IsOptional()
  searchEmailTerm: string = '';
}
