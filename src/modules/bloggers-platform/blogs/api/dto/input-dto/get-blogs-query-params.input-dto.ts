import { ApiProperty } from '@nestjs/swagger';
import { BaseQueryParamsInputDto } from '../../../../../../core/dto';
import { BlogSortByFields } from './blog-sort-by-fields';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class GetBlogsQueryParamsInputDto extends BaseQueryParamsInputDto {
  @ApiProperty({
    enum: BlogSortByFields,
    required: false,
    default: BlogSortByFields.CreatedAt,
  })
  @IsEnum(BlogSortByFields)
  sortBy: BlogSortByFields = BlogSortByFields.CreatedAt;

  @ApiProperty({
    type: String,
    description:
      'Search term for blog Name: Name should contains this term in any position',
    required: false,
  })
  @IsString()
  @IsOptional()
  searchNameTerm: string = '';
}
